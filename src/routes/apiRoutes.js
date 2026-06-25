// ©2026 Vidoose Mahin Ltd develop by (Tanvir)

const express = require('express');
const router = express.Router();
const authenticateGateway = require('../middlewares/authMiddleware');
const mediaController = require('../controllers/mediaController');

// Secure API Routes (x-api-key required for both)
router.post('/extract', authenticateGateway, mediaController.extractMetadata);
router.post('/download', authenticateGateway, mediaController.processAndStream);

module.exports = router;