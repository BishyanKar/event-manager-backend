let mongoose = require('mongoose');

let artistByIDSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    first_name: String,
    last_name: String,
    profile_img: String

},{collection: 'artists'});

module.exports = mongoose.model("artistByID", artistByIDSchema);