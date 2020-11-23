let mongoose = require('mongoose');

let guestRequest = new mongoose.Schema({
    referalID: String,
    event:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'events'
    },
    initiaterID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    },
    users: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users'
        },
        username: String,
        name: String
      }
    ],
    people: Number,
    date_of_request: Date,
    food: Number,
    goodies: Number,
    drinks: Number
},{collection: 'guestRequests'});

guestRequest.index({'event': "text"})
guestRequest.index({'referalID' : "text"})

let guestRequestModel  =  mongoose.model("guestRequests", guestRequest);

module.exports = guestRequestModel;