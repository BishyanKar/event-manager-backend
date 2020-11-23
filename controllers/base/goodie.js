

let goodiesModel = require('../../models/base/goodie');

class Goodie {
    constructor(payload, params=null) {
        
        this.payload = payload;
        this.params = params;    
        
    }

    async goodiesList() {
        try {
            let response;
            response = await goodiesModel.find({});
            if(response) {
                return response
            } else {
                throw new CustomError('not working', 500 , 'goodiesList');
            }
        } catch (error) {
            throw new CustomError(error.message, 500 , 'goodiesList');
        }
    }

    async goodieByID() {
        try {
            let id = this.params.id;
            let response = [];
            if(this.params.id) {
                response = await goodiesModel.findOne({"_id": id})
            } else {
                throw new CustomError('No id found', 500 , 'goodieList');
            }
            return response
        } catch (error) {
            throw new CustomError(error.message, 500 , 'goodieList');
        }
    }
    
}

module.exports = Goodie;
