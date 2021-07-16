const bcrypt = require('bcrypt')
const JWT = require("jsonwebtoken")
const signupModel = require('../Models/signup')
const express = require('express')
const router = express.Router();
const multer=require('multer')  
const path=require('path')  
require("../config/conn")

// signup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        // console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
//---> The file upload manage in image 
const upload=multer({
    dest:'images',
    limits:{
        fileSize:1000000
    },
    storage:storage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
       cb(undefined, true)
    },
})


// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'src/images')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now())
//     }
//   })
   
//   var upload = multer({ storage: storage }).single('image')


router.post('/signup', upload.single('image'), async (req,res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const image=req.file.filename;
    // const image = req.body.image;

    if(!username)
    {
        return res.send({
            status:false,
            error:'Username is required'
        })
    }
    if(!email)
    {
        return res.send({
            status:false,
            error:'Email is required'
        })
    }
    if(!password)
    {
        return res.send({
            status:false,
            error:'Password is required'
        })
    }



    const emailExist  = await signupModel.findOne({email:email})
    if(emailExist)
    {   
        return res.send({
            status:false,
            error:'Email is already is already exist'
        })
    }
    else{
        const salt = await bcrypt.genSalt(10);
        var token = JWT.sign({email:email},"facebook");
        const hashpassword = await bcrypt.hash(password,salt)
        const signupuser  = await new signupModel({
            username,
            email,
            password:hashpassword,
            image
        })

      
        await signupuser.save().then((data) => {
            return res.send({
                status:true,
                message:"you have successfully signup",
                token:token,
                userdata:signupuser
            })
        }).catch((error) => {
            return res.send({
                status:true,
                message:"something went wrong!"
            })
        })
    }
})


///login

router.post('/login', async (req,res) => {
    const email =  req.body.email;
    const password =  req.body.password;

    if(!email)
    {
        return res.send({
            status:false,
            error:"Email is required"
        })
    }
    if(!password)
    {
        return res.send({
            status:false,
            error:"Passsword is required"
        })
    }
    const emailExits = await signupModel.findOne({email:email})
    console.log(emailExits,"{}{}{}{}")
    if(!emailExits)
    {
        return res.send({
            status:false,
            error:"Email is not exits"
        })
    }
    else{
        const hashpassword = await bcrypt.compare(password,emailExits.password)
        if(hashpassword)
        {
            var token = JWT.sign({email:email,id:emailExits._id},"facebook");
            return res.send({
                status:true,
                message:"You are Login successfully!",
                token:token,
                userid:emailExits._id
            })
        }
        else{
            return res.send({
                status:true,
                message:"password is wrong"
            })
        }
    }
})


//updateuserProfile
router.put("/updateprofile/:id", async (req,res) => {
    try{
        const postUpdate =await signupModel.findByIdAndUpdate(req.params.id,req.body,{
            new:true
        });
        res.send(postUpdate);
    }catch(e){
        res.status(500).send(e);
    }
})

//getallprofile by id
router.get("/getprofileid/:id", async (req,res) => {
    try{
        const _id = req.params.id;
        const getUser =await signupModel.findById({_id});
        res.send(getUser);
    }catch(e){
        res.status(400).send(e);
    }
})

//getallprofile
router.get("/getprofile", async (req,res) => {
    try{
        const getProfile =await signupModel.find({});
        res.send(getProfile);
    }catch(e){
        res.status(500).send(e);
    }
})

//Search API
router.get("/search/:username", (req,res) => {
    const search =  new RegExp(req.params.firstName);
    console.log(search,"{}{}{}")
    signupModel.find({firstName:search}).then((result)=>{
        res.status(200).json(result)
    })
})


module.exports = router
