const mongoose = require('mongoose')

const signupSchema = new mongoose.Schema({
    username : {
        type: String,
        required:true
    },
    email : {
        type: String,
        required:true
    },
    password : {
        type: String,
        required:true
    },
    image : {
        type: String,
    }
})

module.exports = mongoose.model('signup', signupSchema);    