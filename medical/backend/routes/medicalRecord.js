const express = require('express');
const router = express.Router();
const MedicalRecord = require('../models/Medicalrecord');

// Define routes for CRUD operations
router.get('/', async (req, res) => {
  try {
    const medicalRecords = await MedicalRecord.find();
    res.json(medicalRecords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, age, gender, nationalId, report } = req.body;
    const medicalRecord = new MedicalRecord({
      name,
      age,
      gender,
      nationalId,
      report,
    });
    await medicalRecord.save();
    res.status(201).json(medicalRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, gender, nationalId, report } = req.body;

    const updatedMedicalRecord = await MedicalRecord.findByIdAndUpdate(
      id,
      { name, age, gender, nationalId, report },
      { new: true }
    );

    res.json(updatedMedicalRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await MedicalRecord.findByIdAndDelete(id);

    res.json({ message: `Medical record with ID ${id} has been deleted` });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
