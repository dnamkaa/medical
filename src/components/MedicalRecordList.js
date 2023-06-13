import React, { useEffect, useState } from 'react';

function MedicalRecords() {
  const [medicalRecords, setMedicalRecords] = useState([]);

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      const response = await fetch('your-api-endpoint');
      const data = await response.json();
      setMedicalRecords(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Medical Records</h2>
      {medicalRecords.length > 0 ? (
        <ul>
          {medicalRecords.map((record) => (
            <li key={record.id}>
              <p>{record.name}</p>
              <p>{record.date}</p>
              <p>{record.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No medical records found.</p>
      )}
    </div>
  );
}

export default MedicalRecords;
