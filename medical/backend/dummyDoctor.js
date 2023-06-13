const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

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
    await User.deleteMany({});

    // Create dummy users with hashed passwords
    const dummyUsers = [
      {
        fullName: 'John Doe',
        email: 'johndoe@example.com',
        gender: 'Male',
        workingStation: 'Hospital A',
        jobDescription: 'Doctor',
        password: await bcrypt.hash('password1', 10), // Hashed password
      },
      {
        fullName: 'Jane Smith',
        email: 'janesmith@example.com',
        gender: 'Female',
        workingStation: 'Hospital B',
        jobDescription: 'Nurse',
        password: await bcrypt.hash('password2', 10), // Hashed password
      },
      // Add more dummy users as needed
    ];

    // Insert the dummy users
    await User.insertMany(dummyUsers);

    console.log('Dummy data populated successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error populating dummy data:', error);
    mongoose.connection.close();
  }
}
