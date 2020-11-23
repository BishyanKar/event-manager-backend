

let EventsModel = require('../../models/base/event');
const spotifyApi = require('../../common/spotify');
const { use } = require('../../routes/admin/login');
const e = require('express');

class Event {
    constructor(payload, params=null, eventID = null, ticketID = null) {
        this.eventID = eventID;
        this.ticketID = ticketID;
        this.payload = payload;
        this.params = params;
        this.event = null
    }

    async setEvent(){
        try {
            if(this.eventID) { 
                let response = await EventsModel.eventModel.findById(this.eventID)
                if(response)
                    this.event = response
                else
                    throw new CustomError('No event with that id', 500 , 'setEvent');

            } else {
                throw new CustomError('EventID wasn\'t available', 500 , 'setEvent');
            }
          } catch (error) {
              throw new CustomError(error.message, error.statusCode, error.functionName);
          }
    }

    async eventList() {
        try {
            let response;
            response = await EventsModel.eventModel.find({}).sort({start_date: 1}).populate('food.id').populate('goodies.id').populate('drinks.id').populate('ticket_types.id');
            response = JSON.parse(JSON.stringify(response));
            for(let j  = 0; j < response.length; j++){
                for(let i = 0; i < response[j].artists_performing.length; i++){
                    let data = await spotifyApi.getArtist(response[j].artists_performing[i].id)
                    response[j].artists_performing[i].images = data.body.images
                } 
            }
            if(response) {
                return response;
            } else {
                throw new CustomError('not working', 500 , 'eventList');
            }
        } catch (error) {
            //console.log(error)
            throw new CustomError(error.message, 500 , 'eventList');
        }
    }
    async eventListAdmin() {
        try {
            let response;
            response = await EventsModel.eventModel.find({}).sort({start_date: 1});
            if(response) {
                return response;
            } else {
                throw new CustomError('not working', 500 , 'eventList');
            }
        } catch (error) {
            //console.log(error)
            throw new CustomError(error.message, 500 , 'eventList');
        }
    }
    
    async eventByID() {
        try {
            let id = this.params.id ? this.params.id : eventID;
            let resp = [], response = [];
            if(id) {
                resp = await EventsModel.eventModel.findOne({"_id": id}).populate('food.id').populate('goodies.id').populate('drinks.id').populate('ticket_types.id');
                if(!resp){
                    throw new CustomError('No event by given id found', 500 , 'eventByID');
                }
                response = JSON.parse(JSON.stringify(resp));
                // //console.log(resp)
                for(let i = 0; i < response.artists_performing.length; i++){
                    let data = await spotifyApi.getArtist(response.artists_performing[i].id)
                    // //console.log(data.body.images)
                    response.artists_performing[i]['images'] = data.body.images
                }
                let validOptions = []
                for(let i = 0; i < response.guest_options.length; i++){
                    if(response.guest_options[i].count < response.guest_count)
                        validOptions.push(response.guest_options[i])
                }
                response.guest_options = validOptions
            } else {
                throw new CustomError('No id found', 500 , 'eventByID');
            }
            // //console.log(response)
            return response
        } catch (error) {
            throw new CustomError(error.message, 500 , 'eventByID');
        }
    }

    async rewardsByGuestCount() {
        try {
            let count = Number(this.params.count);
            let response = [];
            if(count) {
                if(count >= 5 && count < 10) {
                    response = await EventsModel.rewardsModel.findOne({"count": 5})
                } else if(count >= 10 && count < 15) {
                    response = await EventsModel.rewardsModel.findOne({"count": 10})
                } else if(count >= 15) {
                    response = await EventsModel.rewardsModel.findOne({"count": 15})
                } else {
                    response = [];
                }
            } else {
                throw new CustomError('No id found', 500 , 'eventList');
            }
            return response
        } catch (error) {
            throw new CustomError(error.message, 500 , 'eventList');
        }
    }
    
    async voucherSelection() {
        try {
            let response;
            response = await EventsModel.find({});
            if(response) {
                return response
            } else {
                throw new CustomError('not working', 500 , 'eventList');
            }
        } catch (error) {
            throw new CustomError(error.message, 500 , 'eventList');
        }
    }

    async attendingList() {
        try {
            let response;
            response = await EventsModel.find({});
            if(response) {
                return response
            } else {
                throw new CustomError('not working', 500 , 'eventList');
            }
        } catch (error) {
            throw new CustomError(error.message, 500 , 'eventList');
        }
    }

    async giveawaysList() {
        try {
            let response;
            response = await EventsModel.find({});
            if(response) {
                return response
            } else {
                throw new CustomError('not working', 500 , 'eventList');
            }
        } catch (error) {
            throw new CustomError(error.message, 500 , 'eventList');
        }
    }

    async fandBList() {
        try {
            let response;
            response = await EventsModel.find({});
            if(response) {
                return response
            } else {
                throw new CustomError('not working', 500 , 'eventList');
            }
        } catch (error) {
            throw new CustomError(error.message, 500 , 'eventList');
        }
    }

    async addTicket(){
        try{
            let response;
            if(this.eventID && this.ticketID) {
                response = await EventsModel.eventModel.findById(this.eventID);
                if(response) {
                    response.tickets.push(this.ticketID)
                    await response.save()
                
                    return {
                       sucess: true,
                       response
                    }
                } else {
                    throw new CustomError('Invalid Event ID', 500, 'addTicket');
                }
            } else {
                throw new CustomError('No id found', 500 , 'addTicket');
            }  
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    async deleteTicket(){
        try{
            let response;
            if(this.eventID && this.ticketID) {
                response = await EventsModel.eventModel.findById(this.eventID);
                if(response) {
                    response.tickets.splice(response.tickets.indexOf(this.ticketID), 1)
                    await response.save()
                
                    return {
                       sucess: true,
                       response
                    }
                } else {
                    throw new CustomError('Invalid Event ID', 500, 'deleteTicket');
                }
            } else {
                throw new CustomError('No id found', 500 , 'deleteTicket');
            }  
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }


    async addGuest(guests){
        try{
            let response;
            if(this.eventID && guests) {
                if(!this.event)
                    await this.setEvent()
                response = this.event;
                if(response) {
                    //console.log(response)
                    for(let i = 0; i < guests.length; i++)
                        response.guest_list.push(guests[i])
                    // response.guest_list =  response.guest_list.concat(guests)
                    //console.log(response.guest_list)
                    //console.log(typeof(response))

                    await response.save()
                    return {
                       sucess: true,
                       left: response.guest_count - response.guest_list.length,
                       response
                    }
                } else {
                    throw new CustomError('Invalid Event ID', 500, 'addGuest');
                }
            } else {
                throw new CustomError('No id found', 500 , 'addGuest');
            }  
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    async addGuestRequest(id){
        try{
            if(!this.event)
            await this.setEvent()
            this.event.guest_request_list.push(id)
            await this.event.save()
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    async hasRequested(id){
        if(!this.event)
            await this.setEvent()
        for(let i= 0; i < this.event.guest_request_list.length; i++){
          if(this.event.guest_request_list[i] == id){
            //   //console.log(true)
            return true
          }
              
        }
        return false
    }

}

module.exports = Event;
