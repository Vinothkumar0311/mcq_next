// routes/venueRoutes.js
const express = require('express');
const router = express.Router();
const venueController = require('../../controllers/Slot/venueController');

// GET /api/venues - Get all venues
router.get('/', venueController.getAllVenues);

// POST /api/venues - Create new venue
router.post('/', venueController.createVenue);

// PUT /api/venues/:id - Update venue
router.put('/:id', venueController.updateVenue);

// DELETE /api/venues/:id - Delete venue
router.delete('/:id', venueController.deleteVenue);

module.exports = router;