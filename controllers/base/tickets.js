
let TicketsModel = require('../../models/base/tickets'); 
let ProfileController = require('../user/profile')
let EventsController = require('./event')

class Tickets {
    constructor(payload, params=null) {
        
        this.payload = payload;
        this.params = params;    
        
    }
    
    async typesList() {
        try {
            let response;
            response = await TicketsModel.typeModel.find({});
            if(response) {
                return response
            } else {
                throw new CustomError('not working', 500 , 'typesList');
            }        
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    async getTypeByID() {
        try {
            let response = [];
            if(this.params.id) {
                response = await TicketsModel.typeModel.findOne({"_id": id})
            } else {
                throw new CustomError('No ID found', 500 , 'getTypeByID');
            }
            return response
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    async fetchTickets() {
        try {
            let response;
            response = await TicketsModel.ticketModel.find({}).sort({date_of_purchase: -1});
            if(response) {
                return response;
            } else {
                throw new CustomError('not working', 500 , 'fetchTickets');
            }          
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }
    
    async ticketByID() {
        try {
            let id = this.params.id;
            let response = [];
            if(this.params.id) {
                response = await (await TicketsModel.ticketModel.findOne({"_id": id})).populate('type').populate('event').populate('user')
            } else {
                throw new CustomError('No id found', 500 , 'ticketByID');
            }  
            return response          
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    async bookTickets() {
        try {
            let tickets = []
            let types = this.payload.typeID;
            types = types.slice(1, types.length-1)
            types = types.split(', ')
            for(let i = 0; i < types.length; i++){
                let ttype = types[i];
                ttype = ttype.split('=')
                let today = new Date();
                let userID = this.payload.userID
                let refKey = String(Date.now());
                let ref = refKey.slice(refKey.length-11)+userID.slice(userID.length-4)+i;
                let obj = {
                    price: this.payload.price,
                    currency:  this.payload.currency,
                    type: ttype[0],
                    event:  this.payload.eventID,
                    user: userID,
                    referalID: ref,
                    people: Number(ttype[1]),
                    date_of_purchase : today,
                    transactionID: this.payload.transactionID,
                    isGuest: false,
                    guest_detail: {
                        count: 0,
                        food: 0,
                        goodies: 0,
                        drinks: 0,
                    }
                }
                let newTicket = await TicketsModel.ticketModel.create(obj);
                if(newTicket) {
                    let profile = new ProfileController(null, null, userID, newTicket._id)
                    await profile.addTicket()
                    let event = new EventsController(null, null, this.payload.eventID, newTicket._id)
                    await event.addTicket()
                    tickets.push(newTicket)
                } else{
                    throw new CustomError('Something went wrong.', 500, 'bookTickets');
                }
            }
            return {
                success: true,
                tickets 
            }
            

        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    async bookGuestTickets() {
        try{
            //console.log(this.payload)
            let today = new Date();
            let userID = String(this.payload.userID)
            let eventID = String(this.payload.eventID)
            let refKey = String(Date.now());
            //console.log(typeof(userID))
            let ref = refKey.slice(refKey.length-11)+userID.slice(userID.length-4)
            //console.log(ref)
            let obj = {
                price: 0,
                currency:  "INR",
                type: null,
                event:  eventID,
                user: userID,
                referalID: ref,
                people: this.payload.people,
                date_of_purchase : today,
                transactionID: null,
                isGuest: true,
                guest_detail: {
                    count: this.payload.count,
                    food: this.payload.food,
                    goodies: this.payload.goodies,
                    drinks: this.payload.drinks,
                }
            }
            let newTicket = await TicketsModel.ticketModel.create(obj);
            if(newTicket) {
                
                let profile = new ProfileController(null, null, userID, newTicket._id)
                await profile.addTicket()
                let event = new EventsController(null, null, eventID, newTicket._id)
                await event.addTicket()
                //console.log(newTicket)
                return {
                    success: true,
                    newTicket 
                }
            } else{
                throw new CustomError('Something went wrong.', 500, 'bookGuestTickets');
            }

        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }


    async editTicket() {
        try {

            let response;
            if(this.params.id) {

                let userObj;
                if(this.payload.price) {
                    userObj = {...userObj, ...{price: this.payload.price}}
                }
                if(this.payload.discount) {
                    userObj = {...userObj, ...{discount: this.payload.discount}}
                }
                if(this.payload.currency) {
                    userObj = {...userObj, ...{currency: this.payload.currency}}
                }
                if(this.payload.type) {
                    userObj = {...userObj, ...{type: this.payload.type}}
                }
                if(this.payload.event) {
                    userObj = {...userObj, ...{event: this.payload.event}}
                }

                if(userObj){
                    response = await TicketsModel.ticketModel.findByIdAndUpdate(this.params.id,userObj,{new:true , runValidators: true});
                    if(response) {
                        return {
                            success: true,
                            response
                        }
                    } else {
                        throw new CustomError('Failed to update ticket.', 500 , 'editTicket');
                    }
                }else {
                    throw new CustomError('Add some data to edit.', 500 , 'editTicket');
                }
            } else {
                throw new CustomError('No event found', 500 , 'editTicket');
            }

        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    async deleteTicket() {
        try {
            let response;
            if(this.params.id) {
                response = await TicketsModel.ticketModel.findByIdAndDelete(this.params.id,{ runValidators: true});
                if(response) {
                    let event = new EventsController(null, null, this.payload.eventID, newTicket._id)
                    await event.deleteTicket()
                    let profile = new ProfileController(null, null, userID, newTicket._id)
                    await profile.deleteTicket()
                    
                    return {
                        success: true,
                        response
                    }
                } else {
                    throw new CustomError('No ticket found', 500 , 'deleteTicket');
                }
            } else {
                throw new CustomError('No id found', 500 , 'deleteTicket');
            }
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }
    
}

module.exports = Tickets;
