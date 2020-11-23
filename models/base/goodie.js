let mongoose = require('mongoose');

let goodieSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    rating: Number
},{collection: 'goodies'});

goodieSchema.index({name: 'text'})

module.exports = mongoose.model("goodie", goodieSchema);