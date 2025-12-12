const { Slot, SlotBooking } = require("../../models");
const { get } = require("../../routes/authRoutes");

const slotBookingController = {
  bookSlot: async (req, res) => {
    try {
      const { slotId, studentId } = req.body;

      if (!slotId || !studentId) {
        return res.status(400).json({
          success: false,
          error: "slotId and studentId are required",
        });
      }

      // 1. Check slot exists
      const slot = await Slot.findByPk(slotId);
      if (!slot) {
        return res.status(404).json({
          success: false,
          error: "Slot not found",
        });
      }

      // 2. Check seat availability
      if (slot.seatsLeft <= 0) {
        return res.status(400).json({
          success: false,
          error: "No seats available",
        });
      }

      // 3. Prevent double booking
      const existingBooking = await SlotBooking.findOne({
        where: { slotId, studentId, status: "Booked" },
      });

      if (existingBooking) {
        return res.status(400).json({
          success: false,
          error: "You have already booked this slot",
        });
      }

      // 4. Create booking
      const booking = await SlotBooking.create({
        slotId,
        studentId,
      });

      // 5. Reduce seat count
      await slot.update({
        seatsLeft: slot.seatsLeft - 1,
      });

      return res.status(201).json({
        success: true,
        message: "Slot booked successfully",
        data: booking,
      });
    } catch (error) {
      console.error("Error booking slot:", error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  // OPTIONAL: Cancel Booking
  cancelBooking: async (req, res) => {
    try {
      const { bookingId } = req.params;

      const booking = await SlotBooking.findByPk(bookingId);
      if (!booking) {
        return res.status(404).json({
          success: false,
          error: "Booking not found",
        });
      }

      const slot = await Slot.findByPk(booking.slotId);

      await booking.update({ status: "Cancelled" });

      // Increase seat count
      await slot.update({
        seatsLeft: slot.seatsLeft + 1,
      });

      return res.json({
        success: true,
        message: "Booking cancelled successfully",
      });
    } catch (error) {
      console.error("Error cancelling booking:", error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  getBookingsByStudent: async (req, res) => {
    try {
      const { studentId } = req.params;

      const bookings = await SlotBooking.findAll({
        where: { studentId },
        include: [Slot],
      });

      return res.json({
        success: true,
        data: bookings,
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
};

module.exports = slotBookingController;
