let mongoose = require('mongoose');

let loginSchema = new mongoose.Schema({

    email: String,
    password: String,

},{timestamps: true} ,{collection: 'users'});


let loginModel = mongoose.model("types", loginSchema);

module.exports = { loginModel }; 