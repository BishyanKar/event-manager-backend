

let BandModel = require('../../models/base/band');

class Band {
    constructor(payload, params=null) {
        
        this.payload = payload;
        this.params = params;    
        
    }

    async bandList() {
        try {
            let response;
            response = await BandModel.find({});
            if(response) {
                return response;
            } else {
                throw new CustomError('No Bands available.', 500 , 'bandList');
            }
        } catch (error) {
            throw new CustomError(error.message, 500 , 'bandList');
        }
    }

    async bandByID() {
        try {
            let id = this.params.id;
            let response = [];
            if(this.params.id) {
                response = await BandModel.findOne({"_id": id})
                if(response) {
                    return response
                } else{
                    throw new CustomError('No band found', 500 , 'bandByID');
                }
            } else {
                throw new CustomError('No id found', 500 , 'bandByID');
            }

            
        } catch (error) {
            throw new CustomError(error.message, 500 , 'bandByID');
        }
    }

    async addBand() {
        try {
            let today = new Date();
 
            let obj = {
                name: this.payload.name,
                description:  this.payload.description,
                launch_date:  this.payload.launch_date,
                artists_list: this.payload.artists_list,
                popularity:  this.payload.popularity,
                // profile_img : this.file.profile_img,
                albums_list: this.payload.albums_list,
                events_list:  this.payload.events_list,
                category : this.payload.category
            }
            let newTicket = await BandModel.create(obj);
            if(newTicket) {
                return {
                    success: true,
                    newTicket 
                }
            } else{
                throw new CustomError('Something went wrong.', 500, 'bookTickets');
            }

        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }
    async editBand() {
        try {
            let response;
            if(this.params.id) {

                let userObj;
                if(this.payload.name) {
                    userObj = {...userObj, ...{name: this.payload.name}}
                }
                if(this.payload.description) {
                    userObj = {...userObj, ...{description: this.payload.description}}
                }
                if(this.payload.launch_date) {
                    userObj = {...userObj, ...{launch_date: this.payload.launch_date}}
                }
                if(this.payload.artists_list) {
                    userObj = {...userObj, ...{artists_list: this.payload.artists_list}}
                }
                if(this.payload.popularity) {
                    userObj = {...userObj, ...{popularity: this.payload.popularity}}
                }
                if(this.payload.albums_list) {
                    userObj = {...userObj, ...{albums_list: this.payload.albums_list}}
                }
                if(this.payload.events_list) {
                    userObj = {...userObj, ...{events_list: this.payload.events_list}}
                }
                if(this.payload.category) {
                    userObj = {...start_date, ...{category: this.payload.category}}
                }

                if(userObj){
                    response = await BandModel.findByIdAndUpdate(this.params.id,userObj,{new:true , runValidators: true});
                    if(response) {
                        return {
                            success: true,
                            response
                        }
                    } else {
                        throw new CustomError('Failed to update event.', 500 , 'editBand');
                    }
                }else {
                    throw new CustomError('Add some data to edit.', 500 , 'editBand');
                }
            } else {
                throw new CustomError('No band found', 500 , 'editBand');
            }
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }
    async deleteBand() {
        try {
            let response;
            if(this.params.id) {
                response = await BandModel.findByIdAndDelete(this.params.id,{ runValidators: true});
                if(response) {
                    return {
                        success: true,
                        response
                    }
                } else {
                    throw new CustomError('No band found', 500 , 'deleteBand');
                }
            } else {
                throw new CustomError('No id found', 500 , 'deleteBand');
            }
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }
}

module.exports = Band;
