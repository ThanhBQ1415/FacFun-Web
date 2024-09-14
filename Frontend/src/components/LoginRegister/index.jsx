import React, { useState } from "react";
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { Grid, Paper, Typography, TextField, Button, Snackbar, IconButton } from '@material-ui/core';
import { CloseRounded } from '@material-ui/icons';
import apiUrl from "../../../systemVariable.js";
import "./styles.css";

function LoginAndRegister(props) {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [location, setLocation] = useState('');
  const [occupation, setOccupation] = useState('');
  const [description, setDescription] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(''); // New state for date of birth
  const [loginFalse, setLoginFalse] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [Register, setRegister] = useState(false);

  const switchForm = () => {
    setIsLoginForm(!isLoginForm);
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    axios
      .post(`${apiUrl.api}/api/user/login`, {
        username: loginUsername,
        password: loginPassword
      },{
        credentials: 'include',
        withCredentials: true
      })
      .then((response) => {
        props.onLoginUserChange(response.data);
        if(response.status === 400){
          setLoginFalse(true);
        }
      })
      .catch(() => {
        setLoginFalse(true);
      });
  };

  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    if (registerPassword !== confirmPassword) {
      alert("Mật khẩu và mật khẩu xác nhận không khớp!");
      return;
    }
  
    axios
      .post(`${apiUrl.api}/api/user/register`, {
        username: registerUsername,
        password: registerPassword,
        first_name: firstName,
        last_name: lastName,
        location: location, 
        occupation: occupation,
        description: description,
      },{
        withCredentials: true,
        credentials: "include"
      })
      .then((response) => {
        setIsLoginForm(true); 
        setRegister(true);
      })
      .catch(() => {
        setLoginFalse(true);
      });
  };
  
  if (props.loginUser) {
    return <Navigate to={`/users/${props.loginUser._id}`} state={{ from: "/login-register" }} replace />;
  }
  return (
    <Grid container spacing={2} justifyContent="center" >
      <Grid item xs={6}>
        <Paper elevation={3} style={{ padding: 20 }}>
          <Typography variant="h6" gutterBottom>
            {isLoginForm ? 'Đăng nhập' : 'Đăng ký'}
          </Typography>
          <form onSubmit={isLoginForm ? handleLoginSubmit : handleRegisterSubmit}>
            {!isLoginForm && (
              <>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Tên"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Họ đệm"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />               
              </>
            )}
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Tên đăng nhập"
              value={isLoginForm ? loginUsername : registerUsername}
              onChange={(e) => isLoginForm ? setLoginUsername(e.target.value) : setRegisterUsername(e.target.value)}
              required
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Mật khẩu"
              type="password"
              value={isLoginForm ? loginPassword : registerPassword}
              onChange={(e) => isLoginForm ? setLoginPassword(e.target.value) : setRegisterPassword(e.target.value)}
              required
            />
            {!isLoginForm && (
              <>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Xác nhận mật khẩu"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Địa điểm"
                  type="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Nghề nghiệp"
                  type="occupation"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Mô tả"
                  type="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                
              </>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ background: "#C25241"}}
            >
              {isLoginForm ? 'Đăng nhập' : 'Đăng ký'}
            </Button>
          </form>
          <Button onClick={switchForm}>
            {isLoginForm ? 'Đăng ký tài khoản' : 'Quay lại đăng nhập'}
          </Button>
        </Paper>
        <Snackbar
          open={loginFalse}
          onClose={() => setLoginFalse(false)}
          autoHideDuration={5000}
          message="Tên đăng nhập đã tồn tại"
          action={(
            <IconButton color="secondary" onClick={() => setLoginFalse(false)}>
              <CloseRounded />
            </IconButton>
          )}
        />
        <Snackbar
        open={Register}
        onClose={() => setRegister(false)}
        autoHideDuration={5000}
        message="Đăng ký thành công"
        action={(
          <IconButton color="secondary" onClick={() => setRegister(false)}>
            <CloseRounded />
          </IconButton>
               )}
               />
               </Grid>
             </Grid>
           );
         }
         
         export default LoginAndRegister;
         
