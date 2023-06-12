const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const axios = require('axios');

// Initialize Express app
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/medical_records', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the MedicalRecord schema and model
const medicalRecordSchema = new mongoose.Schema({
  // Define your schema fields
  nationalId: String,
  name: String,
  age: Number,
  gender: String,
});

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

// Define the User schema and model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Login endpoint
app.post('/login', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });

    // Generate OTP and send it to the user's email
    const otp = generateOTP();
    await sendOTPByEmail(email, otp);

    if (!user) {
      // Create a new user if it doesn't exist
      user = new User({ email, otp });
    } else {
      // Update the existing user's OTP
      user.otp = otp;
    }

    await user.save();

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Medical Records endpoint
app.get('/medical-records/:otp', async (req, res) => {
  // Verify the OTP received from the client
  const { email } = req.query;
  const { otp } = req.params;
  const user = await User.findOne({ email });

  if (!user || !user.otp || user.otp !== otp) {
    return res.status(403).json({ message: 'Invalid OTP' });
  }

  try {
    // Fetch the medical records from the database
    const medicalRecords = await MedicalRecord.find();

    res.json(medicalRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// OTP endpoint to receive the OTP via HTTP
app.post('/otp', (req, res) => {
  const { email, otp } = req.body;

  // Handle the received OTP as desired
  console.log('Received OTP:', otp);

  res.status(200).json({ message: 'OTP received successfully' });
});

// Start the server
app.listen(3002, () => {
  console.log('Server listening on port 3002');
});

// Helper function to generate OTP
function generateOTP() {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }

  return otp;
}

// Helper function to send OTP by email
async function sendOTPByEmail(email, otp) {
  try {
    // Console log the OTP
    console.log('OTP:', otp);

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'dnamkaa@gmail.com',
        pass: 'hemedi19',
      },
    });

    // Define the email options
    const mailOptions = {
      from: 'dnamkaa@gmail.com',
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP: ${otp}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');

    // Send the OTP via HTTP to another endpoint
    const otpEndpoint = 'http://localhost:3002/otp'; // Replace with your desired endpoint URL

    await axios.post(otpEndpoint, { email, otp });
    console.log('OTP sent via HTTP to another endpoint');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
