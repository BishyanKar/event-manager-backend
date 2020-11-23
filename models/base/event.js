let mongoose = require('mongoose');

let eventSchema = new mongoose.Schema({

    id: String,
    name: String,
    description: String,
    promotion: String,
    address: {
        country: String,
        state: String,
        city: String,
        location: String,
    },
    start_date: Date,
    end_date: Date,
    entry_fee: {
        type: Number ,
        min: [0, 'Entry fees should be greater than 0.'],   
    },
    currency: String,
    artists_performing: [
        {
            id : String,
            role: String,
            name: String,
            from: String,
            to: String
        }
    ],
    food: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'food'
            }
        }
    ],
    drinks: [
        {
            
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'drink'
            }
        }
    ],
    goodies: [
        {
            
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'goodie'
            }
        }
    ],
    ticket_types: [
        {
            
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ticket_types'
            },
            price: Number,
            currency: String
        }
    ],
    tickets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tickets'
        }
    ],
    guest_count: Number,
    guest_options: [
        {
            count: Number,
            food: Number,
            goodies: Number,
            drinks: Number
        }
    ],
    max_guest: Number,
    guest_list: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
    guest_request_list: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
    images: Array,
    categories: Array,
},{timestamps: true},{collection: 'events'});

let rewardsSchema = new mongoose.Schema({
    count: Number,
    Name: String,
    G: Number,
    GL: Number,
    B: Number,
    img: String
},{timestamps: true},{collection: 'rewards'});


eventSchema.index({'start_date':1})


let eventModel  =  mongoose.model("event", eventSchema);
let rewardsModel = mongoose.model("rewards", rewardsSchema);

module.exports = { rewardsModel,eventModel };