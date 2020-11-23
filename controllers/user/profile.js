let ProfileModel = require('../../models/user/profile');
let EventModel = require('../../models/base/event').eventModel
let TypeModel = require('../../models/base/tickets').typeModel;


class Profile {
    constructor(payload, params=null, userID = null, ticketID = null) {
        this.payload = payload;
        this.params = params;  
        this.userID = userID;
        this.ticketID = ticketID;  
    }

    async profileByID() {
        try {
            let response;
            if(this.params.id) {
                response = await ProfileModel.findOne({"_id": this.params.id}).populate('tickets');
                // console.log(response)
                response = JSON.parse(JSON.stringify(response))
                for(let i = 0; i < response.tickets.length; i++){

                    console.log(response.tickets[i].type)
                    let type = await TypeModel.findOne({"_id":response.tickets[i].type}).lean()
                    console.log(type)
                    type = JSON.parse(JSON.stringify(type))
                    response.tickets[i].type = type
                    let event = await EventModel.findOne({"_id":response.tickets[i].event}).lean()
                    // console.log(event)
                    event = JSON.parse(JSON.stringify(event))
                    response.tickets[i].event = event
                }
                // console.log(response)
                if(response) {
                    return {
                        success: true,
                        response
                    }
                } else {
                    throw new CustomError('No user found', 500 , 'profileByID');
                }
            } else {
                throw new CustomError('No id found', 500 , 'profileByID');
            }
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    async updateProfile() {
        try {
            let response;
            if(this.params.id) {
                let userObj = {
                    events_attended: this.payload.events_attended,
                    first_name: this.payload.first_name,
                }

                response = await ProfileModel.findByIdAndUpdate(this.params.id,userObj,{new:true});
                
                if(response) {
                   return {
                       sucess: true,
                       response
                   }
                } else {
                    throw new CustomError('Profile not updated', 500, 'updateProfile');
                }
            } else {
                throw new CustomError('No id found', 500 , 'updateProfile');
            }        
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    async addTicket(){
        try{
            let response;
            if(this.userID && this.ticketID) {
                response = await ProfileModel.findById(this.userID);
                if(response) {
                    response.tickets.push(this.ticketID)
                    await response.save()
                
                   return {
                       sucess: true,
                       response
                   }
                } else {
                    throw new CustomError('Invalid User ID', 500, 'addTicket');
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
            if(this.userID && this.ticketID) {
                response = await ProfileModel.findById(this.userID);
                if(response) {
                    response.tickets.splice(response.tickets.indexOf(this.ticketID), 1)
                    await response.save()
                
                   return {
                       sucess: true,
                       response
                   }
                } else {
                    throw new CustomError('Invalid User ID', 500, 'deleteTicket');
                }
            } else {
                throw new CustomError('No id found', 500 , 'deleteTicket');
            }  
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }


    async addGenre(){
        try{
            let response;
            if(this.payload.userID && this.payload.genres) {
                response = await ProfileModel.findByIdAndUpdate(this.payload.userID, {genres: this.payload.genres});
                if(response) {
                   return {
                       sucess: true,
                       response
                   }
                } else {
                    throw new CustomError('Invalid User ID', 500, 'addTicket');
                }
            } else {
                throw new CustomError('No id found', 500 , 'addTicket');
            }  
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }
    
}

module.exports = Profile;
