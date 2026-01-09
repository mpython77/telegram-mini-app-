const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { verifyAdminToken } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Public routes
router.post('/login', asyncHandler(adminController.login));
router.get('/health', asyncHandler(adminController.getHealth));

// Protected admin routes
router.get('/stats', verifyAdminToken, asyncHandler(adminController.getStats));
router.get('/users', verifyAdminToken, asyncHandler(adminController.getUsers));
router.get('/games', verifyAdminToken, asyncHandler(adminController.getGames));
router.delete('/users/:userId', verifyAdminToken, asyncHandler(adminController.deleteUser));

module.exports = router;
