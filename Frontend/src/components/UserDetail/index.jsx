import React, { useState, useEffect } from "react";
import { Typography, Paper, Button } from "@mui/material";

import "./styles.css";
import { useNavigate , useParams } from 'react-router-dom';

import apiUrl from "../../../systemVariable.js";

function UserDetail(props) {
  const userid = useParams().userId;
  let navigate = useNavigate();
  //-----------fetch API-------------------
  const [data, setData] = useState([]);  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiUrl.api}/api/user/${userid}`, {credentials: "include", withCredentials: true}
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [userid]);

  //-----------end fetch API-------------------
  const user = data[0];
  //----------end fetch API----------------
  if (user && props.loginUser) {
    return (
      <>
        <Paper elevation={3} style={{ padding: 20, margin: 20 }}>   
          <Typography variant="h6" style={{ color:'#C25241', fontWeight: '600' }}>Thông tin cá nhân</Typography>
          <div style={{ marginLeft:'10px' }}>
            <Typography variant="body1" style={{ color:'#444444' }}><b>Tên</b>: {user.first_name}</Typography>
            <Typography variant="body1" style={{ color:'#444444' }}><b>Họ đệm</b>: {user.last_name}</Typography>
            <Typography variant="body1" style={{ color:'#444444' }}>
            <b>Mô tả</b>: {user.description}
            </Typography>
            <Typography variant="body1" style={{ color:'#444444' }}><b>Nghề nghiệp</b>: {user.occupation}</Typography>
          </div>
          <Button 
              variant="contained"
              onClick={() => navigate(`/photos/${user._id}`)}
              id="btn"
              style={{ backgroundColor: '#C25241' }}
            >
              Picture Album
            </Button>
        </Paper>
      </>
    );
  }
}

export default UserDetail;
