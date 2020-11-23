let mongoose = require('mongoose');

let ticketSchema = new mongoose.Schema({
    referalID: String,
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ticket_types'
    },
    event:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'events'
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    
    price: {
        type: Number,
        required: 'Price is required',
    },
    people: Number,
    currency: {
        type: String,
        required: 'Currency is required',
    },
    date_of_purchase: Date,
    transactionID: String,
    isGuest: Boolean,
    guest_detail: {
        count: Number,
        food: Number,
        goodies: Number,
        drinks: Number
    }
},{collection: 'tickets'});

ticketSchema.index({'date_of_purchase': 1})
ticketSchema.index({'referalID' : "text"})

let typeSchema = new mongoose.Schema({
    name: String,
    description: String,
    goodies: Number,
    food: Number,
    drinks: Number
},{collection: 'ticket_types'});

typeSchema.index({name: 'text'})

let ticketModel  =  mongoose.model("tickets", ticketSchema);
let typeModel = mongoose.model("ticket_types", typeSchema);

module.exports = { typeModel, ticketModel };