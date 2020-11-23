let mongoose = require('mongoose');

let drinkSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    rating: Number
},{collection: 'drinks'});

drinkSchema.index({name: 'text'})

module.exports = mongoose.model("drink", drinkSchema);