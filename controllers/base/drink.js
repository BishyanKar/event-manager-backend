

let drinksModel = require('../../models/base/drink');

class Drink {
    constructor(payload, params=null) {
        
        this.payload = payload;
        this.params = params;    
        
    }

    async drinksList() {
        try {
            let response;
            response = await drinksModel.find({});
            if(response) {
                return response
            } else {
                throw new CustomError('not working', 500 , 'drinksList');
            }
        } catch (error) {
            throw new CustomError(error.message, 500 , 'drinksList');
        }
    }

    async drinkByID() {
        try {
            let id = this.params.id;
            let response = [];
            if(this.params.id) {
                response = await drinksModel.findOne({"_id": id})
            } else {
                throw new CustomError('No id found', 500 , 'drinkList');
            }
            return response
        } catch (error) {
            throw new CustomError(error.message, 500 , 'drinkList');
        }
    }
    
}

module.exports = Drink;
