let mongoose = require('mongoose');

let foodSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    rating: Number
},{collection: 'foods'});

foodSchema.index({name: 'text'})

module.exports = mongoose.model("food", foodSchema);