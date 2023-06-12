import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ history }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [showOtpField, setShowOtpField] = useState(false);

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
      setError('Invalid email');
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3002/verify-otp', { email, otp });
      const { token } = response.data;
      localStorage.setItem('token', token);
      setError(null);
      history.push('/medical-records');
    } catch (error) {
      setError('Invalid OTP');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p>{error}</p>}
      {!showOtpField ? (
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" value={email} onChange={handleEmailChange} required />
          </div>
          <button type="submit">Send OTP</button>
        </form>
      ) : (
        <form onSubmit={handleOtpVerification}>
          <div>
            <label htmlFor="otp">OTP:</label>
            <input type="text" id="otp" value={otp} onChange={handleOtpChange} required />
          </div>
          <button type="submit">Verify OTP</button>
        </form>
      )}
    </div>
  );
};

export default Login;
