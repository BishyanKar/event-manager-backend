let mongoose = require('mongoose');

let profileSchema = new mongoose.Schema({

    authID: String,
    username: {
        type: String,
        unique: true
    },
    first_name: {
        type: String,
        trim: true,        
    },
    last_name: {
        type: String,
        trim: true,        
    },
    gender: {
        type: String,
        trim: true,        
    },
    preference: {
        type: String,
        trim: true,        
    },
    artists: {
        type: Array,
    },
    about_me: {
        type: String     
    },
    gender: {
        type: String     
    },
    events_attended: {
        type: Array,
    },
    friends: {
        type: Array,
    },
    profile_img: {
        type: String     
    },
    email: {
        type: String     
    },
    country: {
        type: String     
    },
    state: {
        type: String     
    },
    city: {
        type: String     
    },
    status: {
        type: Number,
        max: [1, 'Status must be 0 or 1.'],
        min: [0, 'Status must be 0 or 1.'],
    },
    age: {
        type: Number ,
        max: [60, 'Maximum age limit is 60.'],
        min: [18, 'Minimum age limit is 18.'],   
    },
    password: {
        type: String,
        trim: true,        
    },
    isAdmin: {
        type: Boolean     
    },
    tickets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tickets'
        }
    ],
    genres: [String]

},{timestamps: true},{collection: 'users'});

profileSchema.index({username: "text"})

module.exports = mongoose.model("users", profileSchema);