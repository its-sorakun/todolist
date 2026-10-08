const express = require('express');
const router = express.Router();
const apiKeyController = require('../controllers/apiKeyController');
const { protectCookie } = require('../middleware/authMiddleware');

// API Key generation and management should ONLY be accessible via browser (Cookie)
// Kiko shouldn't be able to generate new API keys for themselves using an API key.
router.use(protectCookie);

router.route('/')
  .get(apiKeyController.getKeys)
  .post(apiKeyController.generateKey);

router.delete('/:id', apiKeyController.revokeKey);

module.exports = router;
