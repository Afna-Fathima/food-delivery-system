const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

// Get all restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    const { cuisine, search, rating } = req.query;
    let query = {};

    if (cuisine) query.cuisine = { $in: [cuisine] };
    if (search) query.name = { $regex: search, $options: 'i' };
    if (rating) query.rating = { $gte: parseFloat(rating) };

    const restaurants = await Restaurant.find(query)
      .populate('owner', 'name email')
      .sort({ rating: -1 });

    res.json({ success: true, data: restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get restaurant by ID
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('owner', 'name email phone')
      .populate('menu');

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    res.json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create restaurant
exports.createRestaurant = async (req, res) => {
  try {
    const { name, description, address, phone, email, cuisines, deliveryTime, deliveryCharge, minimumOrderValue } = req.body;

    if (!name || !description || !phone || !email) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const restaurant = new Restaurant({
      name,
      owner: req.user.userId,
      description,
      address,
      phone,
      email,
      cuisine: cuisines || [], // cuisines from frontend maps to cuisine in model
      deliveryTime: deliveryTime || 30,
      deliveryCharge: deliveryCharge || 0,
      minimumOrderValue: minimumOrderValue || 0,
    });

    await restaurant.save();
    res.status(201).json({ success: true, message: 'Restaurant created successfully', data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update restaurant
exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    res.json({ success: true, message: 'Restaurant updated successfully', data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete restaurant
exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    // Delete all menu items associated with the restaurant
    await MenuItem.deleteMany({ restaurant: req.params.id });

    res.json({ success: true, message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get restaurants by owner
exports.getRestaurantsByOwner = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.user.userId }).populate('menu');
    res.json({ success: true, data: restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
