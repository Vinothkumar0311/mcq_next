// // controllers/slotController.js
// const { Slot, Venue } = require('../../models');

// const slotController = {
//   getAllSlots: async (req, res) => {
//     try {
//       const slots = await Slot.findAll({
//         include: [{
//           model: Venue,
//           attributes: ['id', 'name', 'block', 'maxSeats']
//         }],
//         order: [['date', 'DESC'], ['startTime', 'ASC']]
//       });

//       res.json({
//         success: true,
//         data: slots
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         error: error.message
//       });
//     }
//   },

//   createSlot: async (req, res) => {
//     try {
//       const slotData = req.body;

//       // Verify venue exists
//       const venue = await Venue.findByPk(slotData.venueId);
//       if (!venue) {
//         return res.status(404).json({
//           success: false,
//           error: 'Venue not found'
//         });
//       }

//       const slot = await Slot.create({
//         ...slotData,
//         maxSeats: slotData.maxSeats || venue.maxSeats,
//         seatsLeft: slotData.maxSeats || venue.maxSeats
//       });

//       // Include venue in response
//       const slotWithVenue = await Slot.findByPk(slot.id, {
//         include: [{
//           model: Venue,
//           attributes: ['id', 'name', 'block', 'maxSeats']
//         }]
//       });

//       res.status(201).json({
//         success: true,
//         data: slotWithVenue,
//         message: 'Slot created successfully'
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         error: error.message
//       });
//     }
//   },

//   updateSlot: async (req, res) => {
//     try {
//       const { id } = req.params;
//       const slotData = req.body;

//       const slot = await Slot.findByPk(id);
//       if (!slot) {
//         return res.status(404).json({
//           success: false,
//           error: 'Slot not found'
//         });
//       }

//       await slot.update(slotData);

//       const updatedSlot = await Slot.findByPk(id, {
//         include: [{
//           model: Venue,
//           attributes: ['id', 'name', 'block', 'maxSeats']
//         }]
//       });

//       res.json({
//         success: true,
//         data: updatedSlot,
//         message: 'Slot updated successfully'
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         error: error.message
//       });
//     }
//   },

//   deleteSlot: async (req, res) => {
//     try {
//       const { id } = req.params;

//       const slot = await Slot.findByPk(id);
//       if (!slot) {
//         return res.status(404).json({
//           success: false,
//           error: 'Slot not found'
//         });
//       }

//       await slot.destroy();

//       res.json({
//         success: true,
//         message: 'Slot deleted successfully'
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         error: error.message
//       });
//     }
//   }
// };

// module.exports = slotController;

// controllers/slotController.js
const { Slot, SlotVenue } = require("../../models");

const slotController = {
  getAllSlots: async (req, res) => {
    try {
      const slots = await Slot.findAll({
        include: [
          {
            model: SlotVenue,
            as: "venue",
            attributes: ["id", "name", "block", "maxSeats"],
          },
        ],
        order: [
          ["date", "DESC"],
          ["startTime", "ASC"],
        ],
      });

      res.json({ success: true, data: slots });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // createSlot: async (req, res) => {
  //   try {
  //     const slotData = req.body;
  //     const venue = await SlotVenue.findByPk(slotData.venueId);

  //     if (!venue) return res.status(404).json({ success: false, error: 'Venue not found' });

  //     const slot = await Slot.create({
  //       ...slotData,
  //       maxSeats: slotData.maxSeats || venue.maxSeats,
  //       seatsLeft: slotData.maxSeats || venue.maxSeats
  //     });

  //     const slotWithVenue = await Slot.findByPk(slot.id, {
  //       include: [{ model: SlotVenue, attributes: ['id', 'name', 'block', 'maxSeats'] }]
  //     });

  //     res.status(201).json({
  //       success: true,
  //       data: slotWithVenue,
  //       message: 'Slot created successfully'
  //     });
  //   } catch (error) {
  //     res.status(500).json({ success: false, error: error.message });
  //   }
  // },
  createSlot: async (req, res) => {
    try {
      const slotData = req.body;
      const venue = await SlotVenue.findByPk(slotData.venueId);

      if (!venue) {
        return res.status(404).json({
          success: false,
          error: "Venue not found",
        });
      }

      const slot = await Slot.create({
        ...slotData,
        maxSeats: slotData.maxSeats || venue.maxSeats,
        seatsLeft: slotData.maxSeats || venue.maxSeats,
      });

      const slotWithVenue = await Slot.findByPk(slot.id, {
        include: [
          {
            model: SlotVenue,
            as: "venue", // 👈 alias here too
            attributes: ["id", "name", "block", "maxSeats"],
          },
        ],
      });

      res.status(201).json({
        success: true,
        data: slotWithVenue,
        message: "Slot created successfully",
      });
    } catch (error) {
      console.error("Error creating slot:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateSlot: async (req, res) => {
    try {
      const { id } = req.params;
      const slotData = req.body;

      const slot = await Slot.findByPk(id);
      if (!slot)
        return res
          .status(404)
          .json({ success: false, error: "Slot not found" });

      await slot.update(slotData);

      const updatedSlot = await Slot.findByPk(id, {
        include: [
          { model: SlotVenue,as: 'venue', attributes: ["id", "name", "block", "maxSeats"] },
        ],
      });

      res.json({
        success: true,
        data: updatedSlot,
        message: "Slot updated successfully",
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  deleteSlot: async (req, res) => {
    try {
      const { id } = req.params;

      const slot = await Slot.findByPk(id);
      if (!slot)
        return res
          .status(404)
          .json({ success: false, error: "Slot not found" });

      await slot.destroy();
      res.json({ success: true, message: "Slot deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};

module.exports = slotController;
