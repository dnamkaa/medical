const express = require('express');
const router = express.Router();
const MedicalRecord = require('./medicalRecord');

// Define routes for CRUD operations
router.get('/', authenticateToken, async (req, res) => {
  try {
    const medicalRecords = await MedicalRecord.find();
    res.json(medicalRecords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, age, gender, nationalId, email, report } = req.body;
    const medicalRecord = new MedicalRecord({
      name,
      age,
      gender,
      nationalId,
      email,
      report,
    });
    await medicalRecord.save();
    res.status(201).json(medicalRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, gender, nationalId, email, report } = req.body;

    const updatedMedicalRecord = await MedicalRecord.findByIdAndUpdate(
      id,
      { name, age, gender, nationalId, email, report },
      { new: true }
    );

    res.json(updatedMedicalRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await MedicalRecord.findByIdAndDelete(id);

    res.json({ message: `Medical record with ID ${id} has been deleted` });
  } catch (err) {
    res.status(400).json({ error: err.message });
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

module.exports = router;
