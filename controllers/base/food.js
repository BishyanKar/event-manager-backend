

let foodModel = require('../../models/base/food');

class Food {
    constructor(payload, params=null) {
        
        this.payload = payload;
        this.params = params;    
        
    }

    async foodList() {
        try {
            let response;
            response = await foodModel.find({});
            if(response) {
                return response
            } else {
                throw new CustomError('not working', 500 , 'foodList');
            }
        } catch (error) {
            throw new CustomError(error.message, 500 , 'foodList');
        }
    }

    async foodByID() {
        try {
            let id = this.params.id;
            let response = [];
            if(this.params.id) {
                response = await foodModel.findOne({"_id": id})
            } else {
                throw new CustomError('No id found', 500 , 'foodList');
            }
            return response
        } catch (error) {
            throw new CustomError(error.message, 500 , 'foodList');
        }
    }
    
}

module.exports = Food;
