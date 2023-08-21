const mongoose = require('mongoose')

const userschema = mongoose.Schema({
    name : {
        type: String,
        required: [true, 'Please add a name']
    },
    email : {
        type: String,
        required: [true, 'Please add a email'],
        unique: true
    },
    password : {
        type: String,
        required: [true, 'Please add a passwaord']
    }
},{
    timestamps: true
})

module.exports = mongoose.model("User", userschema)