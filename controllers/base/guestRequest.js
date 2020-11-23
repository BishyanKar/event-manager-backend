
let GuestRequestModel = require('../../models/base/guestRequest');
let EventModel = require("../../models/base/event").eventModel
let ProfileController = require('../user/profile')
let EventsController = require('./event')
let TicketController = require('./tickets')

class GuestRequest {
    constructor(payload, params=null) {
        
        this.payload = payload;
        this.params = params;    
        
    }

    async guestRequestsByEvent() {
        try {
            let response = [];
            if(this.payload.eventID){
              response = await GuestRequestModel.find({event: this.payload.eventID});
              return response;
            } else {
              throw new CustomError('No eventID given', 500 , 'guestRequestsByEvent');
            }           
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }
    
    async guestRequestByID() {
        try {
          let response = [];
            if(this.params.id) {
                response = await GuestRequestModel.findOne({"_id": this.params.id})
            } else {
                throw new CustomError('No id found', 500 , 'guestRequestByID');
            }  
            return response          
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    async requestGuestEntry() {
        try {
          let eventController = new EventsController(null, null, this.payload.eventID)
          await eventController.setEvent()
          let valid = await eventController.hasRequested(this.payload.userID)
          // //console.log(valid)
          if(valid){
            return {
              success: false,
              message: "User already in requests list." 
            }
          }
          let today = new Date();
          let userID = this.payload.userID
          let refKey = String(Date.now());
          let ref = refKey.slice(refKey.length-11)+userID.slice(userID.length-4)
          let obj = {
              event:  this.payload.eventID,
              initiaterID: userID,
              users: [],
              referalID: ref,
              people: this.payload.people,
              date_of_request : today,
              food: this.payload.food,
              goodies: this.payload.goodies,
              drinks: this.payload.drinks,
          
          }
          let guestRequest = await GuestRequestModel.create(obj)
          if(guestRequest){
            await eventController.addGuestRequest(this.payload.userID)
            return {
              success: true,
              guestRequest
            }
          } else {
            throw new CustomError('Something went wrong.', 500, 'requestGuestEntry');
          }
          
            

        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    async addUser(){
      try {
        let response;
        if(this.payload.referalID && this.payload.userID) {
            let check = await this.checkReferalID()
            if (check.success){
              response = check.response
              let eventController = new EventsController(null, null, response.event, null)
              await eventController.setEvent()
              
              if(await eventController.hasRequested(this.payload.userID)){                //User trying to enter in different guest lists
                return {
                  success: false,
                  message: "User already exists in requests list"
                }
              }

              check.response.users.push({
                id: this.payload.userID,
                username: this.payload.username,
                name: this.payload.name
              })
              check.response.save()
              await eventController.addGuestRequest(this.payload.userID)

              if(check.response.users.length == check.response.people){
                let obj = {
                  eventID: response.event,
                  userID: response.initiaterID,
                  people: response.people + 1,
                  count: response.people,
                  food: response.food,
                  goodies: response.goodies,
                  drinks: response.drinks
                }
                let ticketC = new TicketController(obj)
                let ticket = await ticketC.bookGuestTickets()

                //INSERT NOTIFICATION LOGIC
                //console.log(1)
                let guests = [response.initiaterID]
                for(let i = 0; i < response.users.length; i++){
                  guests.push(response.users[i].id)
                }
                let resp = await eventController.addGuest(guests);
                //console.log(2)
                this.payload.eventID = response.event
                await this.deleteGuestRequest(check.response._id)
                if(resp.left <= resp.response.max_guest)
                  await this.purgeImpossibleRequests(resp.left)
                //console.log(3)

                
                //console.log(4)

                return {
                  success: true,
                  ticket
                }
              }
              else{
                return {
                  success: true,
                  message: "user added",
                  request: check.response
                }
              }
            } else {
              return check
            }
        } else {
            throw new CustomError('Either referalID or userID wasn\'t available', 500 , 'addUser');
        }
      } catch (error) {
          throw new CustomError(error.message, error.statusCode, error.functionName);
      }
    }

    async purgeImpossibleRequests(limit){
      try {
        let count = 0;
        if(this.payload.eventID) {
          let requests = await this.guestRequestsByEvent()
          //console.log(1.1)

          for(let i = 0; i < requests.length; i++){
            if(limit <= requests[i].people){

              //console.log("1.1"+i)
              //INSERT FAILED TO CONFIRM REQUEST NOTIFICATION LOGIC HERE

              await this.deleteGuestRequest(requests[i]._id)
            }
          }
        } else {
            throw new CustomError('EventID wasn\'t available', 500 , 'purgeImpossibleRequests');
        }
      } catch (error) {
          throw new CustomError(error.message, error.statusCode, error.functionName);
      }
    }

    async checkReferalID(){
      try {
        let response;
        if(this.payload.referalID && this.payload.userID) {
            response = await GuestRequestModel.findOne({referalID: this.payload.referalID});
            if(response) {
                let resp
                if (response.initiaterID == this.payload.userID) {           //if initiater tries to add again
                  return {
                    success: false,
                    message: 'User already registered'
                  }
                }
                for(let i = 0; i < response.users.length; i++){             //If a user tries to add again
                  if(response.users[i].id == this.payload.userID){
                    return {
                      success: false,
                      message: 'User already registered'
                    }
                  }
                }
                return {
                    success: true,
                    response
                }
            } else {
                return {
                  success: false,
                  message: "Invalid ID"
                }
            }
        } else {
            throw new CustomError('Either referalID or userID wasn\'t available', 500 , 'checkReferalID');
        }
      } catch (error) {
          throw new CustomError(error.message, error.statusCode, error.functionName);
      }
    }

    
    async deleteGuestRequest(id = null) {
        try {
            let response;
            id = id? id: this.params.id
            if(id) {
              //console.log(2.1)
                response = await GuestRequestModel.findByIdAndDelete(id);
                //console.log(2.2)
                if(response) {
                    
                    return {
                        success: true,
                        response
                    }
                } else {
                    throw new CustomError('No guestRequest found', 500 , 'deleteGuestRequest');
                }
            } else {
                throw new CustomError('No id found', 500 , 'deleteGuestRequest');
            }
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }


    
    
}

module.exports = GuestRequest;
