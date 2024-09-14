const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const uploadCloud = require("../middleware/ulpoadCloud.middleware")
const auth = require("../middleware/auth.middleware")

// [post] /api/photo/new
router.post(
  "/new", 
  (req, res, next) => auth.hasSessionRecord(req,res,next),
  upload.single('photo'),
  (req, res, next) => uploadCloud.upload(req, res, next),
  async (request, response) => {
    try{
      console.log(request.body);
      const newPhoto = new Photo({
        file_name : request.body.photo,
        user_id : request.body.user_id,
        post_content : request.body.postContent
      })
      newPhoto.save();
      response.sendStatus(200);
    }
    catch(e){
      response.status(500).send({ e });
    }
  }
);

// [post] /api/photo/commentsOfPhoto/:photo_id
router.post(
  "/commentsOfPhoto/:photo_id", 
  (req, res, next) => auth.hasSessionRecord(req,res,next),
  async (request, response) => {
    console.log(request.body)
    const photo = await Photo.findOne({_id: request.body.photo_id})

    if(photo){
      const Comment = {
        comment: request.body.cmt, 
        date_time: new Date().toISOString(),
        user_id: request.cookies.user_id
      };
      if (!photo.comments) photo.comments = [Comment];
      else{
        photo.comments.push(Comment);    
      }
      photo.save();
      console.log("** Server: a new comment added! **");
      response.status(200).send(); 
    }
    else{
      response.status(400).json({ message: "Server: Photo you just commented is not found" });
    }
  }
)

// [get] /api/photo/photosOfUser/:id 
router.get(
  "/photosOfUser/:id", 
  (req, res, next) => auth.hasSessionRecord(req,res,next),
  async (request, response) => {
    try {
      const id = request.params.id;
      const photosData = await Photo.find({ user_id: id });
      const photos = JSON.parse(JSON.stringify(photosData))
      for(const photo of photos) {
        if(photo.comments.length > 0){
          for (const cmt of photo.comments) {
            const user = await User.findOne({_id: cmt.user_id})
            cmt.user = user
          }
          
        }
      }
      response.send(photos);
    } catch (error) {
      response.status(500).send({ error });
    }
});

module.exports = router;
