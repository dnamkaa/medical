const mongoose = require('mongoose');
const MedicalRecord = require('./models/Medicalrecord'); 

mongoose.connect('mongodb://localhost:27017/medical_records', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB successfully');

    populateDummyData();
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });

async function populateDummyData() {
  try {
    // Clear existing data
    await MedicalRecord.deleteMany({});

    // Create dummy records
    const dummyRecords = [
      {
        name: 'John Doe',
        age: 30,
        gender: 'Male',
        nationalID: '1234567890',
        email: 'dnamkaa@gmail.com',
        report: 'Lorem ipsum dolor sit amet.',
      },
      {
        name: 'Jane Smith',
        age: 25,
        gender: 'Female',
        nationalID: '9876543210',
        email:'dnamkaa@gmail.com',
        report: 'Lorem ipsum dolor sit amet.',
      },
      // Add more dummy records as needed
    ];

    // Insert the dummy records
    await MedicalRecord.insertMany(dummyRecords);

    console.log('Dummy data populated successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error populating dummy data:', error);
    mongoose.connection.close();
  }
}
