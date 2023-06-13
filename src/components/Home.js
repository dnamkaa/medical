import React from 'react';
import { Button } from '@mui/material';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () =>{
    navigate('/login', { replace: true });
  }

  return (
    <div>
      <div style={{ padding: '20px' }}>
        <h1>Welcome to the Medical Records Dashboard</h1>
        <p>
          This is the homepage of the Medical Records Dashboard. You can use this dashboard to access and manage your medical records.
        </p>
        <p>
          Please login to access the dashboard features.
        </p>
        <Button color='primary' onClick={handleLoginClick}>Login</Button>
      </div>
    </div>
  );
};

export default Home;
