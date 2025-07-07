const express = require('express');
const router = express.Router();
const {
  getPastPolls,
  getActivePoll,
} = require('../controllers/pollController');
const { getActiveStudents } = require('../controllers/studentController');

// Get past polls
router.get('/polls', async (req, res) => {
  try {
    const polls = await getPastPolls();
    res.json(polls);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get active poll
router.get('/active-poll', async (req, res) => {
  try {
    const poll = await getActivePoll();
    res.json(poll);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get active students
router.get('/active-students', async (req, res) => {
  try {
    const students = await getActiveStudents();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
