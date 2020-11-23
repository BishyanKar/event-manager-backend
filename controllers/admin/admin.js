let ProfileModel = require('../../models/user/profile');
let EventsModel = require('../../models/base/event');
let ArtistsModel = require('../../models/base/artist');
let FoodModel = require('../../models/base/food');
let DrinksModel = require('../../models/base/drink');
let GoodiesModel = require('../../models/base/goodie');
let TypesModel = require('../../models/base/tickets').typeModel;


class Profile {
    constructor(payload, params=null, file = null, query = null) {
        this.payload = payload;
        this.params = params;    
        this.file = file;
        this.query = query
    }

//--------------------------------------------------------------------
//      USERS
//--------------------------------------------------------------------

    async getAllUsers() {
        try {
            let response;
            response = await ProfileModel.find({isAdmin: false}).lean();
            if(response) {
                return response
            } else {
                throw new CustomError('No user found', 500 , 'getAllUsers');
            }

        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }
    async editUser() {
        try {
            let response;
            if(this.params.id) {
                let userObj;

                if(this.payload.first_name) {
                    userObj = {...userObj, ...{first_name: this.payload.first_name}}
                }
                if(this.payload.last_name) {
                    userObj = {...userObj, ...{last_name: this.payload.last_name}}
                }
                if(this.payload.email) {
                    userObj = {...userObj, ...{email: this.payload.email}}
                }
                if(this.payload.country) {
                    userObj = {...userObj, ...{country: this.payload.country}}
                }
                if(this.payload.state) {
                    userObj = {...userObj, ...{state: this.payload.state}}
                }
                if(this.payload.city) {
                    userObj = {...userObj, ...{city: this.payload.city}}
                }
                if(this.payload.gender) {
                    userObj = {...userObj, ...{gender: this.payload.gender}}
                }
                if(this.payload.age) {
                    userObj = {...userObj, ...{age: this.payload.age}}
                }
                if(userObj){
                    response = await ProfileModel.findByIdAndUpdate(this.params.id,userObj,{new:true , runValidators: true});
                    if(response) {
                        return {
                            success: true,
                            response
                        }
                    } else {
                        throw new CustomError('Failed to update user.', 500 , 'editUser');
                    }
                }else {
                    throw new CustomError('Add some data to edit.', 500 , 'editUser');
                }

            } else {
                throw new CustomError('No user found', 500 , 'editUser');
            }
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }
    async deleteUser() {
        try {
            let response;
            if(this.params.id) {
                response = await ProfileModel.findByIdAndDelete(this.params.id,{ runValidators: true});
                if(response) {
                    return {
                        success: true,
                        response
                    }
                } else {
                    throw new CustomError('No user found', 500 , 'deleteUser');
                }
            } else {
                throw new CustomError('No id found', 500 , 'deleteUser');
            }
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }


    async changeStatus() {
        try {
            let response;
            if(this.params.id) {
                let userObj = {
                    status : Number(this.payload.status)
                }
                response = await ProfileModel.findByIdAndUpdate(this.params.id,userObj,{new:true , runValidators: true});
                if(response) {
                    return {
                        success: true,
                        response
                    }
                } else {
                    throw new CustomError('No user found', 500 , 'changeStatus');
                }
            } else {
                throw new CustomError('No id found', 500 , 'changeStatus');
            }
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    //----------------------------------------------------------------------------
    //        EVENTS
    //----------------------------------------------------------------------------
    
    async upcomingEventsList() {
        try {
            let response;
            let today = new Date();
            response = await EventsModel.eventModel.aggregate([
                {
                  $match: { start_date : { $gte: today  } }
                },
                {
                  $sort: { createdAt: 1 }
                }
              ])

            if(response) {
                return {
                    success: true,
                    response
                }
            } else {
                throw new CustomError('No events found', 500 , 'upcomingEventsList');
            }

        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    async pastEventsList() {
        try {
            let response;
            let today = new Date();
            response = await EventsModel.eventModel.aggregate([
                {
                  $match: { start_date : { $lt : today  } }
                },
                {
                  $sort: { createdAt: 1 }
                }
              ])

            if(response) {
                return {
                    success: true,
                    response
                }
            } else {
                throw new CustomError('No event found', 500 , 'pastEventsList');
            }

        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    async addEvent() {
        try {
            let obj = {
                guest_list: this.payload.guest_list ? this.payload.guest_list : [],
                images: this.file && this.file.filename ? [this.file.filename] : [],
                categories: this.payload.categories ? this.payload.categories : [],
                name: this.payload.name ?  this.payload.name : null,
                description : this.payload.description ? this.payload.description : null,
                address: {
                    country: this.payload.country ? this.payload.country : null,
                    state: this.payload.state ? this.payload.state : null,
                    city: this.payload.city ? this.payload.city : null,
                    location: this.payload.location ? this.payload.location : null,
                },
                start_date: this.payload.start_date ? this.payload.start_date : null,
                end_date: this.payload.end_date ? this.payload.end_date : null,
                entry_fee : this.payload.entry_fee ? this.payload.entry_fee : 0,
                currency : this.payload.currency ? this.payload.currency : null,
                promotion : this.payload.promotion ? this.payload.promotion : null,
                guest_count : this.payload.guest_count ? this.payload.guest_count : 0
            }
            // console.log(this.payload.artists)()
            if(this.payload.artists){
                let artists = Array.prototype.slice.call(this.payload.artists)
                // console.log(artists)
                obj.artists_performing = []
                for(let i = 0; i < artists.length; i++) {
                    const artist = artists[i]
                    // console.log(artist)
                    if(artist.deleted == 0){
                        obj.artists_performing.push({
                            name: artist.name,
                            id: artist.id,
                            role: artist.role,
                            from: artist.from,
                            to: artist.to
                        })
                    }
                    // console.log(obj.artists_performing)
                };
                
            }
            if(this.payload.food){
                let food = Array.prototype.slice.call(this.payload.food)
                // console.log(food)
                obj.food = []
                for(let i = 0; i < food.length; i++) {
                    const foodItem = food[i]
                    // console.log(foodItem)
                    if(foodItem.deleted == 0){
                        obj.food.push({id: foodItem.id})
                    }
                    // console.log(obj.artists_performing)
                };
                
            }
            if(this.payload.drinks){
                let drinks = Array.prototype.slice.call(this.payload.drinks)
                // console.log(drinks)
                obj.drinks = []
                for(let i = 0; i < drinks.length; i++) {
                    const drink = drinks[i]
                    // console.log(drink)
                    if(drink.deleted == 0){
                        obj.drinks.push({id: drink.id})
                    }
                    // console.log(obj.artists_performing)
                };
                
            }

            if(this.payload.goodies){
                let goodies = Array.prototype.slice.call(this.payload.goodies)
                // console.log(goodies)
                obj.goodies = []
                for(let i = 0; i < goodies.length; i++) {
                    const goodie = goodies[i]
                    // console.log(goodie)
                    if(goodie.deleted == 0){
                        obj.goodies.push({id: goodie.id})
                    }
                    // console.log(obj.artists_performing)
                };
                
            }
            if(this.payload.types){
                let types = Array.prototype.slice.call(this.payload.types)
                // console.log(types)
                obj.ticket_types = []
                for(let i = 0; i < types.length; i++) {
                    const type = types[i]
                    // console.log(type)
                    if(type.deleted == 0){
                        obj.ticket_types.push({
                            price: type.price,
                            id: type.id,
                            currency: type.currency
                        })
                    }
                    // console.log(obj.types_performing)
                };
                
            }
            if(this.payload.guest_options){
                obj.max_guest = 0;
                let guest_options = Array.prototype.slice.call(this.payload.guest_options)
                // console.log(guest_options)
                obj.guest_options = []
                for(let i = 0; i < guest_options.length; i++) {
                    const guest_option = guest_options[i]
                    // console.log(guest_option)
                    if(guest_option.deleted == 0){
                        if(obj.max_guest < guest_option.count)
                        obj.max_guest = guest_option.count
                        obj.guest_options.push({
                            count: guest_option.count,
                            food: guest_option.food,
                            goodies: guest_option.goodies,
                            drinks: guest_option.drinks
                        })
                    }
                    // console.log(obj.guest_options)
                };
                
            }
            
            // console.log("here")
            // console.log(obj.artists_performing)
            let newEvent = await EventsModel.eventModel.create(obj);
            if(newEvent) {
                return {
                    success: true,
                    newEvent 
                }
            } else{
                throw new CustomError('Something went wrong.', 500, 'addEvent');
            }

        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }
    
    async editEvent() {
        try {
            let response;
            if(this.params.id) {
                // console.log(this.payload.address)
                let userObj;
                // console.log(this.payload)
                if(this.payload.guest_options && this.payload.guest_options != {}){
                    let guest_options = Array.prototype.slice.call(this.payload.guest_options)
                    // console.log(guest_options)
                    let guest_options_updated = []
                    for(let i = 0; i < guest_options.length; i++) {
                        const guest_option = guest_options[i]
                        // console.log(guest_option)
                        if(guest_option.deleted == 0){
                            guest_options_updated.push({
                                count: guest_option.count,
                                food: guest_option.food,
                                goodies: guest_option.goodies,
                                drinks: guest_option.drinks
                            })
                        }
                        // console.log(obj.artists_performing)
                    };
                    userObj = {...userObj, ...{guest_options: guest_options_updated}}
                    
                }
                
                if(this.payload.artists && this.payload.artists != {}){
                    let artists = Array.prototype.slice.call(this.payload.artists)
                    // console.log(artists)
                    let artists_performing = []
                    for(let i = 0; i < artists.length; i++) {
                        const artist = artists[i]
                        // console.log(artist)
                        if(artist.deleted == 0){
                            artists_performing.push({
                                name: artist.name,
                                id: artist.id,
                                role: artist.role,
                                from: artist.from,
                                to: artist.to
                            })
                        }
                        // console.log(obj.artists_performing)
                    };
                    userObj = {...userObj, ...{artists_performing: artists_performing}}
                    
                }
                if(this.payload.types && this.payload.types != {}){
                    let types = Array.prototype.slice.call(this.payload.types)
                    // console.log(types)
                    let ticket_types = []
                    for(let i = 0; i < types.length; i++) {
                        const type = types[i]
                        // console.log(type)
                        if(type.deleted == 0){
                            ticket_types.push({
                                price: type.price,
                                id: type.id,
                                currency: type.currency
                            })
                        }
                        // console.log(obj.artists_performing)
                    };
                    userObj = {...userObj, ...{ticket_types: ticket_types}}
                    
                }
                if(this.payload.food && this.payload.food != {}){
                    let foodItems = Array.prototype.slice.call(this.payload.food)
                    // console.log(food)
                    let food = []
                    for(let i = 0; i < foodItems.length; i++) {
                        const foodItem = foodItems[i]
                        // console.log(foodItem)
                        if(foodItem.deleted == 0){
                            food.push({
                                id: foodItem.id
                            })
                        }
                        // console.log(obj.food)
                    };
                    userObj = {...userObj, ...{food: food}}
                    
                }
                if(this.payload.drinks && this.payload.drinks != {}){
                    let drinkItems = Array.prototype.slice.call(this.payload.drinks)
                    // console.log(drinks)
                    let drinks = []
                    for(let i = 0; i < drinkItems.length; i++) {
                        const drinkItem = drinkItems[i]
                        // console.log(drinkItem)
                        if(drinkItem.deleted == 0){
                            drinks.push({
                                id: drinkItem.id
                            })
                        }
                        // console.log(obj.drinks)
                    };
                    userObj = {...userObj, ...{drinks: drinks}}
                    
                }
                if(this.payload.goodies && this.payload.goodies != {}){
                    let goodieItems = Array.prototype.slice.call(this.payload.goodies)
                    // console.log(goodies)
                    let goodies = []
                    for(let i = 0; i < goodieItems.length; i++) {
                        const goodieItem = goodieItems[i]
                        // console.log(goodieItem)
                        if(goodieItem.deleted == 0){
                            goodies.push({
                                id: goodieItem.id
                            })
                        }
                        // console.log(obj.goodies)
                    };
                    userObj = {...userObj, ...{goodies: goodies}}
                    
                }
                if(this.file && this.file.filename) {
                    userObj = {...userObj, ...{images: [this.file.filename]}}
                }  
                if(this.payload.categories) {
                    userObj = {...userObj, ...{categories: this.payload.categories}}
                }
                if(this.payload.currency) {
                    userObj = {...userObj, ...{currency: this.payload.currency}}
                }
                if(this.payload.description) {
                    userObj = {...userObj, ...{description: this.payload.description}}
                }
                if(this.payload.promotion) {
                    userObj = {...userObj, ...{promotion: this.payload.promotion}}
                }
                if(this.payload.description) {
                    userObj = {...userObj, ...{description: this.payload.description}}
                }
                if(this.payload.country || this.payload.state || this.payload.city || this.payload.location) {
                    userObj = {...userObj, ...{address: {
                        country: this.payload.country ? this.payload.country : null,
                        state: this.payload.state ? this.payload.state : null,
                        city: this.payload.city ? this.payload.city : null,
                        location: this.payload.location ? this.payload.location : null,
                    }}}
                }
                
                if(this.payload.end_date) {
                    userObj = {...userObj, ...{end_date: this.payload.end_date}}
                }
                if(this.payload.entry_fee) {
                    userObj = {...userObj, ...{entry_fee: this.payload.entry_fee}}
                }
                if(this.payload.images) {
                    userObj = {...userObj, ...{images: this.payload.images}}
                }
                if(this.payload.name) {
                    userObj = {...userObj, ...{name: this.payload.name}}
                }
                if(this.payload.guest_count) {
                    userObj = {...userObj, ...{guest_count: this.payload.guest_count}}
                }
                
                if(this.payload.start_date) {
                    userObj = {...userObj, ...{start_date: this.payload.start_date}}
                }

                if(userObj){
                    response = await EventsModel.eventModel.findByIdAndUpdate(this.params.id,userObj,{new:true , runValidators: true});
                    if(response) {
                        return {
                            success: true,
                            response
                        }
                    } else {
                        throw new CustomError('Failed to update event.', 500 , 'editEvent');
                    }
                }else {
                    throw new CustomError('Add some data to edit.', 500 , 'editEvent');
                }
            } else {
                throw new CustomError('No event found', 500 , 'editEvent');
            }
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    async deleteEvent() {
        try {
            let response;
            if(this.params.id) {
                response = await EventsModel.eventModel.findByIdAndDelete(this.params.id,{ runValidators: true});
                if(response) {
                    return {
                        success: true,
                        response
                    }
                } else {
                    throw new CustomError('No event found', 500 , 'deleteEvent');
                }
            } else {
                throw new CustomError('No id found', 500 , 'deleteEvent');
            }
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

//--------------------------------------------------------------------------------------
//                ARTISTS
//------------------------------------------------------------------------------------

    
    async addArtists() {
        try {
            let obj = {
                username: this.payload.username,
                first_name: this.payload.first_name ,
                last_name: this.payload.last_name ,
                profile_img: this.file.filename ? this.file.filename : null,
            }
            let newEvent = await ArtistsModel.create(obj);
            if(newEvent) {
                return {
                    success: true,
                    newEvent 
                }
            } else{
                throw new CustomError('Something went wrong.', 500, 'addArtists');
            }

        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    async editArtists() {
        try {
            let response;
            if(this.params.id) {
                let userObj;
                if(this.file.filename) {
                    userObj = {...userObj, ...{profile_img: this.file.filename}}
                }
                if(this.payload.first_name) {
                    userObj = {...userObj, ...{first_name: this.payload.first_name}}
                }
                if(this.payload.last_name) {
                    userObj = {...userObj, ...{last_name: this.payload.last_name}}
                }
                if(userObj){
                    response = await ArtistsModel.findByIdAndUpdate(this.params.id,userObj,{new:true , runValidators: true});
                    if(response) {
                        return {
                            success: true,
                            response
                        }
                    } else {
                        throw new CustomError('Failed to update event.', 500 , 'editArtists');
                    }
                }else {
                    throw new CustomError('Add some data to edit.', 500 , 'editArtists');
                }

            } else {
                throw new CustomError('No event found', 500 , 'editArtists');
            }
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    
    async deleteArtists() {
        try {
            let response;
            if(this.params.id) {
                response = await ArtistsModel.findByIdAndDelete(this.params.id,{ runValidators: true});
                if(response) {
                    return {
                        success: true,
                        response
                    }
                } else {
                    throw new CustomError('No event found', 500 , 'deleteArtists');
                }
            } else {
                throw new CustomError('No id found', 500 , 'deleteArtists');
            }
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

//-------------------------------------------------------------------------------------------
//                 FOOD
//------------------------------------------------------------------------------------------

    async addFood() {
        try {
            let obj = {
                name: this.payload.name,
                description: this.payload.description ,
                rating: this.payload.rating ,
                image: this.file.filename ? this.file.filename : null,
            }
            let newEvent = await FoodModel.create(obj);
            if(newEvent) {
                return {
                    success: true,
                    newEvent 
                }
            } else{
                throw new CustomError('Something went wrong.', 500, 'addFood');
            }

        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    async editFood() {
        try {
            let response;
            if(this.params.id) {
                let foodObj;
                if(this.file && this.file.filename) {
                    foodObj = {...foodObj, ...{image: this.file.filename}}
                }
                if(this.payload.name) {
                    foodObj = {...foodObj, ...{name: this.payload.name}}
                }
                if(this.payload.description) {
                    foodObj = {...foodObj, ...{description: this.payload.description}}
                }
                if(this.payload.rating) {
                    foodObj = {...foodObj, ...{rating: this.payload.rating}}
                }
                if(foodObj){
                    response = await FoodModel.findByIdAndUpdate(this.params.id,foodObj,{new:true , runValidators: true});
                    if(response) {
                        return {
                            success: true,
                            response
                        }
                    } else {
                        throw new CustomError('Failed to update event.', 500 , 'editFood');
                    }
                }else {
                    throw new CustomError('Add some data to edit.', 500 , 'editFood');
                }

            } else {
                throw new CustomError('No event found', 500 , 'editFood');
            }
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }


    async deleteFood() {
        try {
            let response;
            if(this.params.id) {
                response = await FoodModel.findByIdAndDelete(this.params.id,{ runValidators: true});
                if(response) {
                    return {
                        success: true,
                        response
                    }
                } else {
                    throw new CustomError('No event found', 500 , 'deleteFood');
                }
            } else {
                throw new CustomError('No id found', 500 , 'deleteFood');
            }
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    async searchFood() {
        try {
            let query = this.query.search_query;
            let response = [];
            response = await FoodModel.find({$text: { $search: query } })
            return response
        } catch (error) {
            throw new CustomError(error.message, 500 , 'findFood');
        }
    }

//-------------------------------------------------------------------------------------------
//                 DRINKS
//------------------------------------------------------------------------------------------

    async addDrink() {
        try {
            let obj = {
                name: this.payload.name,
                description: this.payload.description ,
                rating: this.payload.rating ,
                image: this.file.filename ? this.file.filename : null,
            }
            let newEvent = await DrinksModel.create(obj);
            if(newEvent) {
                return {
                    success: true,
                    newEvent 
                }
            } else{
                throw new CustomError('Something went wrong.', 500, 'addDrink');
            }

        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    async editDrink() {
        try {
            let response;
            if(this.params.id) {
                let drinkObj;
                if(this.file && this.file.filename) {
                    drinkObj = {...drinkObj, ...{image: this.file.filename}}
                }
                if(this.payload.name) {
                    drinkObj = {...drinkObj, ...{name: this.payload.name}}
                }
                if(this.payload.description) {
                    drinkObj = {...drinkObj, ...{description: this.payload.description}}
                }
                if(this.payload.rating) {
                    drinkObj = {...drinkObj, ...{rating: this.payload.rating}}
                }
                if(drinkObj){
                    response = await DrinksModel.findByIdAndUpdate(this.params.id,drinkObj,{new:true , runValidators: true});
                    if(response) {
                        return {
                            success: true,
                            response
                        }
                    } else {
                        throw new CustomError('Failed to update event.', 500 , 'editDrink');
                    }
                }else {
                    throw new CustomError('Add some data to edit.', 500 , 'editDrink');
                }

            } else {
                throw new CustomError('No event found', 500 , 'editDrink');
            }
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }


    async deleteDrink() {
        try {
            let response;
            if(this.params.id) {
                response = await DrinksModel.findByIdAndDelete(this.params.id,{ runValidators: true});
                if(response) {
                    return {
                        success: true,
                        response
                    }
                } else {
                    throw new CustomError('No event found', 500 , 'deleteDrink');
                }
            } else {
                throw new CustomError('No id found', 500 , 'deleteDrink');
            }
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    async searchDrink() {
        try {
            let query = this.query.search_query;
            let response = [];
            response = await DrinksModel.find({$text: { $search: query } })
            return response
        } catch (error) {
            throw new CustomError(error.message, 500 , 'findDrink');
        }
    }


//-------------------------------------------------------------------------------------------
//                 GOODIES
//------------------------------------------------------------------------------------------

    async addGoodie() {
        try {
            let obj = {
                name: this.payload.name,
                description: this.payload.description ,
                rating: this.payload.rating ,
                image: this.file.filename ? this.file.filename : null,
            }
            let newEvent = await GoodiesModel.create(obj);
            if(newEvent) {
                return {
                    success: true,
                    newEvent 
                }
            } else{
                throw new CustomError('Something went wrong.', 500, 'addGoodie');
            }

        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    async editGoodie() {
        try {
            let response;
            if(this.params.id) {
                let goodieObj;
                if(this.file && this.file.filename) {
                    goodieObj = {...goodieObj, ...{image: this.file.filename}}
                }
                if(this.payload.name) {
                    goodieObj = {...goodieObj, ...{name: this.payload.name}}
                }
                if(this.payload.description) {
                    goodieObj = {...goodieObj, ...{description: this.payload.description}}
                }
                if(this.payload.rating) {
                    goodieObj = {...goodieObj, ...{rating: this.payload.rating}}
                }
                if(goodieObj){
                    response = await GoodiesModel.findByIdAndUpdate(this.params.id,goodieObj,{new:true , runValidators: true});
                    if(response) {
                        return {
                            success: true,
                            response
                        }
                    } else {
                        throw new CustomError('Failed to update event.', 500 , 'editGoodie');
                    }
                }else {
                    throw new CustomError('Add some data to edit.', 500 , 'editGoodie');
                }

            } else {
                throw new CustomError('No event found', 500 , 'editGoodie');
            }
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }


    async deleteGoodie() {
        try {
            let response;
            if(this.params.id) {
                response = await GoodiesModel.findByIdAndDelete(this.params.id,{ runValidators: true});
                if(response) {
                    return {
                        success: true,
                        response
                    }
                } else {
                    throw new CustomError('No event found', 500 , 'deleteGoodie');
                }
            } else {
                throw new CustomError('No id found', 500 , 'deleteGoodie');
            }
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    async searchGoodie() {
        try {
            let query = this.query.search_query;
            let response = [];
            response = await GoodiesModel.find({$text: { $search: query } })
            return response
        } catch (error) {
            throw new CustomError(error.message, 500 , 'findGoodie');
        }
    }


//-------------------------------------------------------------------------------------------
//                 TICKET TYPES
//------------------------------------------------------------------------------------------

    async addType() {
        try {
            let obj = {
                name: this.payload.name,
                description: this.payload.description ,
                food: this.payload.food ,
                drinks: this.payload.drinks ,
                goodies: this.payload.goodies
            }
            let newEvent = await TypesModel.create(obj);
            if(newEvent) {
                return {
                    success: true,
                    newEvent 
                }
            } else{
                throw new CustomError('Something went wrong.', 500, 'addType');
            }

        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    async editType() {
        try {
            let response;
            if(this.params.id) {
                let typeObj;
                if(this.payload.name) {
                    typeObj = {...typeObj, ...{name: this.payload.name}}
                }
                if(this.payload.description) {
                    typeObj = {...typeObj, ...{description: this.payload.description}}
                }
                if(this.payload.food) {
                    typeObj = {...typeObj, ...{food: this.payload.food}}
                }
                if(this.payload.drinks) {
                    typeObj = {...typeObj, ...{drinks: this.payload.drinks}}
                }
                if(this.payload.goodies) {
                    typeObj = {...typeObj, ...{goodies: this.payload.goodies}}
                }
                if(typeObj){
                    response = await TypesModel.findByIdAndUpdate(this.params.id,typeObj,{new:true , runValidators: true});
                    if(response) {
                        return {
                            success: true,
                            response
                        }
                    } else {
                        throw new CustomError('Failed to update event.', 500 , 'editType');
                    }
                }else {
                    throw new CustomError('Add some data to edit.', 500 , 'editType');
                }

            } else {
                throw new CustomError('No event found', 500 , 'editType');
            }
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }


    async deleteType() {
        try {
            let response;
            if(this.params.id) {
                response = await TypesModel.findByIdAndDelete(this.params.id,{ runValidators: true});
                if(response) {
                    return {
                        success: true,
                        response
                    }
                } else {
                    throw new CustomError('No event found', 500 , 'deleteType');
                }
            } else {
                throw new CustomError('No id found', 500 , 'deleteType');
            }
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    async searchType() {
        try {
            let query = this.query.search_query;
            let response = [];
            response = await TypesModel.find({$text: { $search: query } })
            return response
        } catch (error) {
            throw new CustomError(error.message, 500 , 'findType');
        }
    }


}

module.exports = Profile;
