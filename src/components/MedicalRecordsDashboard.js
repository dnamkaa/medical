import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MedicalRecords = () => {
  const [otp, setOTP] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [medicalRecords, setMedicalRecords] = useState([]);

  const handleOTPChange = (event) => {
    setOTP(event.target.value);
  };

  const handleViewMedicalRecords = () => {
    // Make the API request to validate the OTP
    axios.post('http://localhost:3002/validate-otp', { otp })
      .then((response) => {
        // OTP validation successful, fetch the medical records
        axios.get('http://localhost:3002/medical-records', {
          headers: { Authorization: `Bearer ${response.data.token}` }
        })
          .then((res) => {
            // Medical records fetched successfully
            setMedicalRecords(res.data.medicalRecords);
          })
          .catch((error) => {
            console.error('Error fetching medical records:', error);
          });
      })
      .catch((error) => {
        // OTP validation failed, display error message
        setErrorMessage(error.response.data.error);
      });
  };

  useEffect(() => {
    // Generate the OTP when the component mounts
    axios.post('http://localhost:3002/generate-otp')
      .then((res) => {
        setOTP(res.data.otp);
      })
      .catch((error) => {
        console.error('Error generating OTP:', error);
      });
  }, []);

  return (
    <div>
      <h1>Medical Records</h1>
      {errorMessage && <p>{errorMessage}</p>}
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={handleOTPChange}
      />
      <button onClick={handleViewMedicalRecords}>View Medical Records</button>

      <h2>Medical Records:</h2>
      {medicalRecords.map((record) => (
        <div key={record.id}>
          <h3>{record.title}</h3>
          <p>{record.description}</p>
        </div>
      ))}
    </div>
  );
};

export default MedicalRecords;
