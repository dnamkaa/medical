import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3002/login', {
        email,
        password,
      });

      // Login successful
      console.log(response.data.message);
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      // Incorrect password or user not found
      console.error(error.response.data.error);
    }
  };

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <center>
          <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <div>
                {/* <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                /> */}
                <TextField
                  id="outlined-basic"
                  label="email"
                  variant="outlined"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}

                />

              </div>
              <div>
                {/* <label>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                /> */}
                <TextField
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                />
              </div>
              <button type="submit">Login</button>
            </form>
          </div>
        </center>
      </CardContent>
    </Card>
  );
};

export default Login;
