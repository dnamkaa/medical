const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const medicalRecordRoutes = require('./routes/medicalRecord');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

// Routes
app.use('/api/medical-records', medicalRecordRoutes);

module.exports = app;
