import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ history }) => {
  const [email, setEmail] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3002/login', { email });
      setShowOtpField(true);
      setError(null);
    } catch (error) {
      setError('Invalid email or OTP');
    }
  };

  const handleLoginWithOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3002/login', { email, otp });
      const { token } = response.data;
      localStorage.setItem('token', token);
      history.push('/medical-records');
    } catch (error) {
      setError('Invalid email or OTP');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p>{error}</p>}
      {!showOtpField ? (
        <form onSubmit={handleLogin}>
          <div>
            <label>Email:</label>
            <input type="email" value={email} onChange={handleEmailChange} required />
          </div>
          <button type="submit">Submit</button>
        </form>
      ) : (
        <form onSubmit={handleLoginWithOtp}>
          <div>
            <label>OTP:</label>
            <input type="text" value={otp} onChange={handleOtpChange} required />
          </div>
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
};

export default Login;
