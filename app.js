const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();
require('dotenv').config();
require('./src/config/conn')
require('path')
const signup = require('./src/Routes/signup');
const addpost = require('./src/Routes/addpost')

const port = process.env.port || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json()) 
app.use(express.static('images'));

app.use('/',signup)
app.use('/',addpost)

app.get("/", async(req,res,next) => {
    res.send("Hello Hiren")
})

app.listen(port,() => {
    console.log(`connection done ${port}`)
})