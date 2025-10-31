const MenuItem = require('../models/MenuItem');

// Get all menu items for a restaurant
exports.getMenuItems = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { category } = req.query;

    let query = { restaurant: restaurantId };
    if (category) query.category = category;

    const menuItems = await MenuItem.find(query).populate('restaurant', 'name');
    res.json({ success: true, data: menuItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get menu item by ID
exports.getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id).populate('restaurant');

    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    res.json({ success: true, data: menuItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create menu item
exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, restaurant, image } = req.body;

    if (!name || !description || !price || !category || !restaurant) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const menuItem = new MenuItem({
      name,
      description,
      price,
      category,
      restaurant,
      image,
    });

    await menuItem.save();
    res.status(201).json({ success: true, message: 'Menu item created successfully', data: menuItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    res.json({ success: true, message: 'Menu item updated successfully', data: menuItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    res.json({ success: true, message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search menu items
exports.searchMenuItems = async (req, res) => {
  try {
    const { query, category } = req.query;

    let searchQuery = {};
    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ];
    }
    if (category) searchQuery.category = category;

    const menuItems = await MenuItem.find(searchQuery).populate('restaurant', 'name');
    res.json({ success: true, data: menuItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
