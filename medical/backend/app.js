const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3002;
const secretKey = 'Nana';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/medical_records', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema for the medical record
const medicalRecordSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  nationalId: String,
  email: String,
  report: String,
});

// Create a model based on the schema
const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

// GET endpoint to retrieve a list of all medical records
app.get('/medical-records', authenticateToken, async (req, res) => {
  try {
    // Fetch the medical records from the database
    const medicalRecords = await MedicalRecord.find();

    res.json(medicalRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Middleware function to authenticate the token
function authenticateToken(req, res, next) {
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Missing authorization token' });
  }

  // Verify the token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    // Pass the decoded token payload to the next middleware
    req.user = decoded;
    next();
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
