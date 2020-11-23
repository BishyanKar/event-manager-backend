let mongoose = require('mongoose');

let bandSchema = new mongoose.Schema({

    id: String,
    name: String,
    description: String,
    launch_date: Date,
    artists_list: Array,
    popularity: Number,
    profile_img: String,
    albums_list: Array,
    events_list: Array,
    category: Array,
    
},{collection: 'band'});

module.exports = mongoose.model("band", bandSchema);