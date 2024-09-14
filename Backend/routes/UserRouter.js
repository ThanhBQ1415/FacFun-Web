const express = require("express");
const md5 = require('md5');
const User = require("../db/userModel");
const router = express.Router();
const auth = require("../middleware/auth.middleware")
// [post] /api/user/login 
router.post(
  "/login", 
  async (request, response) => {
    try{
      const loginInfo = request.body; 
      const user = await User.findOne({username: loginInfo.username});
      if(!user){
        response.status(400).json({ message: `Tài khoản "${request.body.login_name}" không tồn tại, vui lòng đăng nhập lại` });
        return;
      }
      else{
        if(md5(loginInfo.password) !== user.password){
          response.status(400).json({ message: `Mật khẩu sai` });
          return;
        }
        console.log("passss")
        const userObj = JSON.parse(JSON.stringify(user));    
        response.cookie("user_id", userObj._id);
        console.log(request.cookies.user_id);          
        response.status(200).json(
          { 
            first_name: userObj.first_name, 
            last_name: userObj.last_name,
            _id: userObj._id 
          });
    }
    }catch(e){
      response.status(500).send({ e });
    }
});

// [post] /api/user/register 
router.post(
  "/register", 
  async (request, response) => {
    try{
      const newInfo = request.body;
      const existUser = await User.findOne({username: newInfo.username})
      if(existUser){
        response.status(400).json({ message: `Tài khoản "${newInfo.username}" đã tồn tại, vui lòng đăng kí lại` });
        return;
      }
      newInfo.password = md5(newInfo.password)
      const newUser = new User(newInfo)
      await newUser.save();
      console.log(`** Server: User logined: ${newUser.username}`);
      const userObj = JSON.parse(JSON.stringify(newUser));        
      response.cookie("user_id", userObj._id);
      response.status(200).json(
        { 
          first_name: userObj.first_name, 
          last_name: userObj.last_name,
          _id: userObj._id 
        });
    } 
    catch(e){
      response.status(500).send({ e });
    }    
});

// [post] /api/user/logout 
router.post(
  "/logout", 
  (req, res, next) => auth.hasSessionRecord(req,res,next),
  async (request, response)=>{
    response.clearCookie('user_id');
    request.session.destroy(err => {
        if(err) {
            console.log("Error in destroying the session");
            response.status(400).send();
        }
        else {
          response.status(200).send();
        }
    });
});

// [get] /api/user/list
router.get(
  "/list", 
  (req, res, next) => auth.hasSessionRecord(req,res,next),
  async (request, response) => {
    try {
      const users = await User.find().select("_id last_name first_name");
      response.send(users);
    } catch (error) {
      response.status(500).send({ error });     
    }
});

// [get] /api/user/:id 
router.get(
  "/:id", 
  (req, res, next) => auth.hasSessionRecord(req,res,next),
  async (request, response) => {
    try {
      const id = request.params.id;
      const user = await User.find({ _id: id });
      response.send(user);
    } catch (error) {
      response.status(500).send({ error });
    }
});

module.exports = router;
