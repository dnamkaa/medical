const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  nationalId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  report: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
