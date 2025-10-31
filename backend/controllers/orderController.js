const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { restaurant, items, deliveryAddress, paymentMethod, notes } = req.body;

    if (!restaurant || !items || items.length === 0 || !deliveryAddress) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Calculate totals
    let subtotal = 0;
    const populatedItems = [];

    for (let item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return res.status(404).json({ success: false, message: `Menu item ${item.menuItem} not found` });
      }
      subtotal += menuItem.price * item.quantity;
      populatedItems.push({
        menuItem: item.menuItem,
        quantity: item.quantity,
        price: menuItem.price,
      });
    }

    const restaurantData = await Restaurant.findById(restaurant);
    const deliveryCharge = restaurantData?.deliveryCharge || 0;
    const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% tax
    const totalPrice = subtotal + deliveryCharge + tax;

    const order = new Order({
      user: req.user.userId,
      restaurant,
      items: populatedItems,
      subtotal,
      deliveryCharge,
      tax,
      totalPrice,
      deliveryAddress,
      paymentMethod,
      notes,
    });

    await order.save();
    await order.populate('restaurant user items.menuItem');

    // Emit socket event to restaurant
    const io = req.app.get('io');
    if (io) {
      io.to(`restaurant-${restaurant}`).emit('new-order', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        customer: order.user.name,
        customerPhone: order.user.phone,
        items: order.items,
        totalPrice: order.totalPrice,
        deliveryAddress: order.deliveryAddress,
        notes: order.notes,
        createdAt: order.createdAt,
      });
      console.log(`Order emitted to restaurant-${restaurant}`);
    }

    res.status(201).json({ success: true, message: 'Order created successfully', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all orders for user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('restaurant', 'name')
      .populate('items.menuItem', 'name price')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurant')
      .populate('user', 'name email phone')
      .populate('items.menuItem');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('restaurant user items.menuItem');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Emit socket event to customer
    const io = req.app.get('io');
    if (io && order.user) {
      io.to(`customer-${order.user._id}`).emit('order-status-updated', {
        orderId: order._id,
        status: order.status,
        updatedAt: order.updatedAt,
      });
      console.log(`Order status update emitted to customer-${order.user._id}`);
    }

    res.json({ success: true, message: 'Order status updated', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.status === 'delivered' || order.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Cannot cancel this order' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ success: true, message: 'Order cancelled successfully', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Rate order
exports.rateOrder = async (req, res) => {
  try {
    const { rating, review } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { rating, review },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, message: 'Order rated successfully', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get restaurant orders
exports.getRestaurantOrders = async (req, res) => {
  try {
    const orders = await Order.find({ restaurant: req.params.restaurantId })
      .populate('user', 'name phone')
      .populate('items.menuItem')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
