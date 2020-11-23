let mongoose = require('mongoose');

let artistSchema = new mongoose.Schema({

    answer:String,
    user:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},

},{ timestamps: true });

module.exports = mongoose.model("answer",answerSchema);