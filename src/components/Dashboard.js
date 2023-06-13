import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MedicalRecords = () => {
  const [token, setToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [medicalRecords, setMedicalRecords] = useState([]);

  const handleTokenChange = (event) => {
    setToken(event.target.value);
  };

  const handleViewMedicalRecords = () => {
    if (token === '') {
      setErrorMessage('Please enter a token.');
      return;
    }

    axios.get('http://localhost:3002/medical-records', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        setMedicalRecords(res.data.medicalRecords);
      })
      .catch((error) => {
        console.error('Error fetching medical records:', error);
        setErrorMessage('Failed to fetch medical records. Please check your token.');
      });
  };

  useEffect(() => {
    // Generate the OTP when the component mounts
    axios.post('http://localhost:3002/generate-otp')
      .then((res) => {
        setToken(res.data.token);
      })
      .catch((error) => {
        console.error('Error generating token:', error);
      });
  }, []);

  return (
    <div>
      <h1>Medical Records</h1>
      {errorMessage && <p>{errorMessage}</p>}
      <input
        type="text"
        placeholder="Enter Token"
        value={token}
        onChange={handleTokenChange}
      />
      <button onClick={handleViewMedicalRecords}>View Medical Records</button>

      <h2>Medical Records:</h2>
      {JSON.stringify(medicalRecords)}
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
