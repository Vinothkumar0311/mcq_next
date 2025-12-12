// // controllers/venueController.js
// const { Venue, Slot } = require('../../models');

// const venueController = {
//   getAllVenues: async (req, res) => {
//     try {
//       const venues = await Venue.findAll({
//         order: [['createdAt', 'DESC']]
//       });
      
//       res.json({
//         success: true,
//         data: venues
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         error: error.message
//       });
//     }
//   },

//   createVenue: async (req, res) => {
//     try {
//       const { name, block, maxSeats, ipRange } = req.body;
      
//       const venue = await Venue.create({
//         name,
//         block,
//         maxSeats,
//         ipRange
//       });
      
//       res.status(201).json({
//         success: true,
//         data: venue,
//         message: 'Venue created successfully'
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         error: error.message
//       });
//     }
//   },

//   updateVenue: async (req, res) => {
//     try {
//       const { id } = req.params;
//       const venueData = req.body;
      
//       const venue = await Venue.findByPk(id);
//       if (!venue) {
//         return res.status(404).json({
//           success: false,
//           error: 'Venue not found'
//         });
//       }
      
//       await venue.update(venueData);
      
//       res.json({
//         success: true,
//         data: venue,
//         message: 'Venue updated successfully'
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         error: error.message
//       });
//     }
//   },

//   deleteVenue: async (req, res) => {
//     try {
//       const { id } = req.params;
      
//       const venue = await Venue.findByPk(id);
//       if (!venue) {
//         return res.status(404).json({
//           success: false,
//           error: 'Venue not found'
//         });
//       }
      
//       await venue.destroy();
      
//       res.json({
//         success: true,
//         message: 'Venue deleted successfully'
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         error: error.message
//       });
//     }
//   }
// };

// module.exports = venueController;

// controllers/venueController.js
const { SlotVenue, Slot } = require('../../models');

const venueController = {
  getAllVenues: async (req, res) => {
    try {
      const venues = await SlotVenue.findAll({ order: [['createdAt', 'DESC']] });
      res.json({ success: true, data: venues });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createVenue: async (req, res) => {
    try {
      const { name, block, maxSeats, ipRange } = req.body;
      const venue = await SlotVenue.create({ name, block, maxSeats, ipRange });

      res.status(201).json({ success: true, data: venue, message: 'Venue created successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateVenue: async (req, res) => {
    try {
      const { id } = req.params;
      const venueData = req.body;

      const venue = await SlotVenue.findByPk(id);
      if (!venue) return res.status(404).json({ success: false, error: 'Venue not found' });

      await venue.update(venueData);
      res.json({ success: true, data: venue, message: 'Venue updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  deleteVenue: async (req, res) => {
    try {
      const { id } = req.params;
      const venue = await SlotVenue.findByPk(id);
      if (!venue) return res.status(404).json({ success: false, error: 'Venue not found' });

      await venue.destroy();
      res.json({ success: true, message: 'Venue deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = venueController;
