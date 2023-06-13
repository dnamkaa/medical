const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/medical_records', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB successfully');
    // Start the server after successful database connection
    app.listen(3002, () => {
      console.log('Server is running on port 3002');
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// User model
const User = require('./models/User');

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the password
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (passwordsMatch) {
      // Generate a JWT token
      const token = jwt.sign({ email: user.email }, 'Nana');

      res.json({ token });
    } else {
      res.status(401).json({ error: 'Incorrect password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate OTP route
app.post('/generate-otp', (req, res) => {
  const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
  res.json({ otp });
});

// MedicalRecord model
const MedicalRecord = require('./models/MedicalRecord');

// Fetch medical records route with token authentication
app.get('/medical-records', (req, res) => {
  // Check for authorization token in the request headers
  const bearerHeader = req.headers.authorization;
  if (!bearerHeader || !bearerHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Extract the token from the header
  const token = bearerHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Verify the JWT token
  jwt.verify(token, 'Nana', async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    try {
      // Fetch all medical records
      const medicalRecords = await MedicalRecord.find();

      res.json({ medicalRecords });
    } catch (error) {
      console.error('Error fetching medical records:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

module.exports = app;
