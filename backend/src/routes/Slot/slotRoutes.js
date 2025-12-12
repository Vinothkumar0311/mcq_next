// routes/slotRoutes.js
const express = require('express');
const router = express.Router();
const slotController = require('../../controllers/Slot/slotController');

// GET /api/slots - Get all slots
router.get('/', slotController.getAllSlots);

// POST /api/slots - Create new slot
router.post('/', slotController.createSlot);

// PUT /api/slots/:id - Update slot
router.put('/:id', slotController.updateSlot);

// DELETE /api/slots/:id - Delete slot
router.delete('/:id', slotController.deleteSlot);

module.exports = router;