const express = require('express');
const { getBuses, getBusById, searchBuses, addBus, updateBus, deleteBus } = require('../controllers/busController');
const { protect } = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const router = express.Router();

// Public routes
router.get('/', getBuses);
router.get('/:id', getBusById);
router.post('/search', searchBuses); // Changed to POST for search

// Admin routes (protected)
router.post('/', protect, adminMiddleware, addBus);
router.put('/:id', protect, adminMiddleware, updateBus);
router.delete('/:id', protect, adminMiddleware, deleteBus);

module.exports = router;
