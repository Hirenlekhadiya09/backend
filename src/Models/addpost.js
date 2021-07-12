const mongoose = require('mongoose')

const addpostSchema = new mongoose.Schema({
    title : {
        type: String,
        required:true
    },
    body : {
        type: String,
        required:true
    },
    image : {
        type: String,
    },
    userid: {
      type: mongoose.Schema.Types.ObjectID,
      ref:"signup"
   },
})

module.exports = mongoose.model('addpost', addpostSchema);    