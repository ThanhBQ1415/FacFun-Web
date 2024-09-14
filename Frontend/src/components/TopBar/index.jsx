import React, { useState, useEffect } from "react";
import { AppBar, Grid, Toolbar, Typography, IconButton, TextField } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import "./styles.css";
import { ExitToApp, CloseRounded } from '@material-ui/icons';
import { Snackbar } from '@material-ui/core';
import axios from "axios";
import apiUrl from "../../../systemVariable.js";


function TopBar(props) {
  let navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [logoutPrompt, setlogoutPrompt] = useState(null);  
  

  //Logout
  const handleLogoutPromptClick = () => {   
    axios  
      .post(`${apiUrl.api}/api/user/logout`, {},{credentials: "include", withCredentials: true})
      .then(response => {
        if (response.status === 200) {
          props.onLoginUserChange(null);
          return navigate(`/login-register`);
        }
      })
      .catch(err => console.log("Error: logout error in posting", err.message));
    setlogoutPrompt(true); 
  };
  //end logout

  // dialog logout alert
  const handleLogoutPromptClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setlogoutPrompt(false);
  };
  //end dialog logout alert

  const handleCloseDialog = () => {
    setOpen(false);
  };

  // end dialog upload photo 

  //set file image
  const handleImageUpload = event => {
    const file = event.target.files[0];
    setSelectedImage(file);
    setOpen(true);  
  };
  // end set file image


  // submit upload photo
  const handleSubmit = (event) => {
    event.preventDefault();
    if(selectedImage.size > 0){
      const form = new FormData();
      form.append("photo", selectedImage);
      form.append("postContent", postContent);
      form.append("user_id", props.loginUser._id) 
      setSelectedImage(null);
      setPostContent('')
      axios
      .post(`${apiUrl.api}/api/photo/new`, form,{credentials: "include", withCredentials: true})
      .then(response => {
          props.onPhotoUpload();
          console.log("photo successfully uploaded");
      })
      .catch(err => console.log("Error: photo uploaded error ", err));
    }
    handleCloseDialog();
  };

  // end submit upload photo 
  if (props.loginUser) {
    return (
      <AppBar position="static">
      <Toolbar  className="topbar-appBar">
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography variant="h5" color="inherit"> 
              Photo Sharing
            </Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={2} lg={2}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              id="upload-image-input"
              name="photo"
            />

            <label htmlFor="upload-image-input" style={{ fontWeight: 'bold', cursor: 'pointer' }}>
              UPLOAD
            </label>



            <Dialog open={open} onClose={handleCloseDialog}>
              <DialogContent >        
                <div style={{ aspectRatio: '4/3', width: '400px', height:'300px', overflow: 'hidden' }}>
                {selectedImage && (
                  <img src={URL.createObjectURL(selectedImage)} alt="Selected" style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
                )}
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleSubmit}>Submit</Button>
                <Button onClick={handleCloseDialog}>Cancel</Button>
              </DialogActions>
            </Dialog>
          </Grid>
          <Grid item style={{display: "flex", alignContent:"center", justifyContent:"center"}}>
            <Typography variant="h6" color="inherit">
              {props.loginUser.first_name}
            </Typography>
            <IconButton title="Log out your account" onClick={handleLogoutPromptClick} variant="contained" >
              <ExitToApp style={{ color: "#ffffff", marginBottom:"8px" }} fontSize="small" />
            </IconButton>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>


    );
  } else {
    return (
      <AppBar position="static">
        <Toolbar style={{ background: "#C25241"}}>
          <Grid container justifyContent="space-between">
            <Grid item> 
              <Typography variant="h5" color="inherit">
                Đăng nhập 
              </Typography>
            </Grid>
            <Snackbar
              open={logoutPrompt}
              onClose={handleLogoutPromptClose}
              autoHideDuration={5000}
              message="Bạn đã đăng xuất tài khoản"
              action={(
              <IconButton color="secondary" onClick={handleLogoutPromptClose}>
                <CloseRounded />
              </IconButton>
            )}
          />

            
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
