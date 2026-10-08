const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const { protectDual } = require('../middleware/authMiddleware');

// Notes can be accessed by both UI (Cookie) and Kiko (API Key)
router.use(protectDual);

router.route('/')
  .get(noteController.getNotes)
  .post(noteController.createNote);

router.route('/:id')
  .put(noteController.updateNote)
  .delete(noteController.deleteNote);

module.exports = router;
