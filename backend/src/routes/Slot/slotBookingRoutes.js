const express = require("express");
const router = express.Router();
const slotBookingController = require("../../controllers/Slot/slotBookingController");

// Book a slot
router.post("/book", slotBookingController.bookSlot);

// Cancel booking (optional)
router.put("/cancel/:bookingId", slotBookingController.cancelBooking);

// Get bookings by student ID
router.get("/student/:studentId", slotBookingController.getBookingsByStudent);

module.exports = router;
