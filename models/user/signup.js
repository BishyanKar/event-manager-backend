let mongoose = require('mongoose');

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

let signupSchema = new mongoose.Schema({

    first_name : {
        type: String,
        trim: true,        
        required: 'First Name is required',
    },
    last_name: {
        type: String,
        trim: true,        
        required: 'Last Name is required',
    },
    age: {
        type: Number,
        required: 'Age is required',
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: 'Password is required',
    },
    retype_password: {
        type: String,
    },
    country: {
        type: String,
        trim: true,        
        required: 'Country is required',
    },
    state: {
        type: String,
        trim: true,        
        required: 'State is required',
    },
    city: {
        type: String,
        trim: true,        
        required: 'City is required',
    },
    gender: {
        type: String,
        trim: true,        
        required: 'Gender is required',
    },
    creation_date: {
        type: Date
    }

},{timestamps: true},{collection: 'users'});


let signupModel = mongoose.model("signup", signupSchema);

module.exports = { signupModel };