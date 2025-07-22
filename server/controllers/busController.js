const Bus = require('../models/busModel');

// GET: All buses with date filter
exports.getBuses = async (req, res, next) => {
  try {
    const { date } = req.query;
    let query = {};
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setUTCHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const buses = await Bus.find(query).sort({ date: 1, departure: 1 });
    res.status(200).json({ success: true, buses });
  } catch (err) {
    next(err);
  }
};

// GET: Single bus by ID
exports.getBusById = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ success: false, message: 'Bus not found' });
    res.status(200).json({ success: true, bus });
  } catch (err) {
    next(err);
  }
};

// POST: Search buses
exports.searchBuses = async (req, res, next) => {
  try {
    const { from, to, date } = req.body;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);

    if (startDate < currentDate) {
      return res.status(400).json({ 
        success: false, 
        message: "Tickets for past dates are not available for booking.",
        buses: [] 
      });
    }

    const buses = await Bus.find({
      from,
      to,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ departure: 1 });

    res.status(200).json({ success: true, buses });
  } catch (err) {
    next(err);
  }
};

// POST: Add a new bus (admin only)
exports.addBus = async (req, res, next) => {
  try {
    console.log('Add bus request received:', req.body, 'User:', req.user);
    const bus = await Bus.create(req.body);
    console.log('Bus created successfully:', bus);
    res.status(201).json({ success: true, bus });
  } catch (err) {
    console.error('Bus creation error:', err);
    next(err);
  }
};

// PUT: Update bus by ID
exports.updateBus = async (req, res, next) => {
  try {
    console.log('Update bus request received:', req.body, 'Bus ID:', req.params.id, 'User:', req.user);
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true
    });
    if (!bus) {
      console.log('Bus update failed: Bus not found');
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }
    console.log('Bus updated successfully:', bus);
    res.status(200).json({ success: true, bus });
  } catch (err) {
    console.error('Bus update error:', err);
    next(err);
  }
};

// DELETE: Remove bus by ID
exports.deleteBus = async (req, res, next) => {
  try {
    console.log('Delete bus request received: Bus ID:', req.params.id, 'User:', req.user);
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) {
      console.log('Bus deletion failed: Bus not found');
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }
    console.log('Bus deleted successfully:', bus);
    res.status(200).json({ success: true, message: 'Bus deleted successfully' });
  } catch (err) {
    console.error('Bus deletion error:', err);
    next(err);
  }
};