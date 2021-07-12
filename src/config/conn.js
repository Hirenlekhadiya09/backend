const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://dbUser:dbUser@cluster0.bthoo.mongodb.net/instaclone?retryWrites=true&w=majority",{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => {
    console.log("Conected with db")
}).catch((e) => {
    console.log("Not Conected")
})