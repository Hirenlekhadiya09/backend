const postModel = require('../Models/addpost')
const userModel = require('../Models/signup')
const express = require('express')
const router =  express.Router();
const multer=require('multer')  
const path=require('path');  

//---> The file upload manage in image 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        // console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

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


router.post('/addpost',  upload.single('image'), async(req,res) => {

    const title = req.body.title;
    const body = req.body.body;
    const image = req.file.filename;
    const userid = req.body.userid;
    console.log(req.body)

    if(!title){
        return res.send({
            status:false,
            message:"Title is required"
        })
    }

    const posts = new postModel({
        title:title,
        body:body,
        image:image,
        userid:userid,
        // Postedusername: req.signup.username,
    })
    console.log(posts,'{}{}{}{}{}')
    await posts.save().then((data) => {
        return res.send({
            status:true,
            message:"Post added successfully"
        })
    })
    .catch((error) => {
        return res.send({
            status:true,
            message:"Something went wrong"
        })
    }) 

})

//getmypost
router.get("/mypost", async (req, res) => {
    const userId = req.query.id;
    console.log("{}}{}{}",userId);
    const data = postModel.find({ userid: userId });
    data
      .then((data) => {
        res.json({ data });
      })
      .catch((error) => {
        res.json({
          error: "Post not available",
        });
      });
  });

  
//Delete
router.delete("/deletepost/:id", async (req,res) => {
    try{
        const postDelete =await postModel.findByIdAndDelete(req.params.id);
        res.send(postDelete);
    }catch(e){
        res.status(500).send(e);
    }
})

//updatepost
router.put("/updatepost/:id", async (req,res) => {
    try{
        const postUpdate =await postModel.findByIdAndUpdate(req.params.id,req.body,{
            new:true
        });
        res.send(postUpdate);
    }catch(e){
        res.status(500).send(e);
    }
})

//getallpost
router.get("/getpost", async (req,res) => {
    try{
        const getPost =await postModel.find({});
        res.send(getPost);
    }catch(e){
        res.status(500).send(e);
    }
})

module.exports = router

