require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding...');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Create multiple restaurant owners - only if they don't exist
    const owners = [];
    const ownerData = [
      { name: 'Raj Patel', email: 'raj@spicekingdom.com', phone: '9100001111' },
      { name: 'Marco Rossi', email: 'marco@pizzaparlour.com', phone: '9100002222' },
      { name: 'Alex Jordan', email: 'alex@burgerbarn.com', phone: '9100003333' },
      { name: 'Priya Sharma', email: 'priya@sushiparadise.com', phone: '9100004444' },
      { name: 'Wei Chen', email: 'wei@chinakitchen.com', phone: '9100005555' },
      { name: 'Raj Kumar', email: 'raj@sweetscoop.com', phone: '9100006666' },
    ];

    for (const owner of ownerData) {
      const existingUser = await User.findOne({ email: owner.email });
      if (existingUser) {
        console.log(`✓ User already exists: ${owner.email}`);
        owners.push(existingUser);
      } else {
        const user = await User.create({
          name: owner.name,
          email: owner.email,
          password: 'password123',
          phone: owner.phone,
          role: 'restaurant',
          address: {
            street: '123 Main Street',
            city: 'Delhi',
            state: 'Delhi',
            zipCode: '110001',
            country: 'India',
          },
        });
        console.log(`✓ Created user: ${owner.email}`);
        owners.push(user);
      }
    }

    // Create customer if doesn't exist
    let customer = await User.findOne({ email: 'arjun@customer.com' });
    if (!customer) {
      customer = await User.create({
        name: 'Arjun Singh',
        email: 'arjun@customer.com',
        password: 'password123',
        phone: '9876543210',
        role: 'customer',
        address: {
          street: '456 Park Avenue',
          city: 'Delhi',
          state: 'Delhi',
          zipCode: '110002',
          country: 'India',
        },
      });
      console.log('✓ Created customer:', customer.name);
    } else {
      console.log('✓ Customer already exists: arjun@customer.com');
    }

    // Restaurant data
    const restaurantsData = [
      {
        name: 'Spice Kingdom',
        owner: owners[0]._id,
        description: 'Authentic Indian cuisine with traditional recipes passed down through generations',
        cuisine: ['Indian', 'North Indian', 'Vegetarian'],
        rating: 4.7,
        reviewCount: 520,
        deliveryTime: 25,
        deliveryCharge: 40,
        minimumOrderValue: 200,
        items: [
          { name: 'Butter Chicken', price: 320, description: 'Tender chicken in creamy sauce', category: 'main', ratings: 4.8 },
          { name: 'Paneer Tikka Masala', price: 280, description: 'Grilled paneer in aromatic sauce', category: 'main', ratings: 4.7 },
          { name: 'Biryani', price: 350, description: 'Fragrant basmati rice with meat', category: 'main', ratings: 4.9 },
          { name: 'Samosa', price: 80, description: 'Crispy pastry with spiced potato', category: 'appetizer', ratings: 4.6 },
          { name: 'Garlic Naan', price: 60, description: 'Fresh butter naan with garlic', category: 'side', ratings: 4.7 },
          { name: 'Lassi', price: 80, description: 'Traditional yogurt-based drink', category: 'beverage', ratings: 4.5 },
          { name: 'Gulab Jamun', price: 120, description: 'Soft dumplings in sugar syrup', category: 'dessert', ratings: 4.8 },
        ],
      },
      {
        name: 'Pizza Parlour',
        owner: owners[1]._id,
        description: 'Wood-fired pizzas with authentic Italian recipes and premium ingredients',
        cuisine: ['Pizza', 'Italian', 'Continental'],
        rating: 4.6,
        reviewCount: 380,
        deliveryTime: 30,
        deliveryCharge: 50,
        minimumOrderValue: 300,
        items: [
          { name: 'Margherita Pizza', price: 320, description: 'Classic mozzarella and tomato', category: 'main', ratings: 4.7 },
          { name: 'Pepperoni Pizza', price: 380, description: 'Loaded with pepperoni slices', category: 'main', ratings: 4.8 },
          { name: 'Veggie Delight', price: 350, description: 'Fresh vegetables and cheese', category: 'main', ratings: 4.6 },
          { name: 'Garlic Bread', price: 150, description: 'Crispy bread with garlic butter', category: 'appetizer', ratings: 4.7 },
          { name: 'Pasta Carbonara', price: 280, description: 'Creamy pasta with bacon', category: 'main', ratings: 4.5 },
          { name: 'Coke', price: 60, description: 'Chilled soft drink', category: 'beverage', ratings: 4.4 },
          { name: 'Tiramisu', price: 180, description: 'Italian dessert classic', category: 'dessert', ratings: 4.9 },
        ],
      },
      {
        name: 'Burger Barn',
        owner: owners[2]._id,
        description: 'Gourmet burgers with premium beef and fresh toppings',
        cuisine: ['Burgers', 'American', 'Fast Food'],
        rating: 4.5,
        reviewCount: 290,
        deliveryTime: 20,
        deliveryCharge: 30,
        minimumOrderValue: 150,
        items: [
          { name: 'Classic Cheeseburger', price: 250, description: 'Juicy beef with melted cheese', category: 'main', ratings: 4.6 },
          { name: 'Double Stack Burger', price: 320, description: 'Two patties with special sauce', category: 'main', ratings: 4.8 },
          { name: 'Veggie Burger', price: 220, description: 'Plant-based patty with veggies', category: 'main', ratings: 4.4 },
          { name: 'French Fries', price: 100, description: 'Crispy golden fries', category: 'side', ratings: 4.7 },
          { name: 'Onion Rings', price: 120, description: 'Battered and fried onion rings', category: 'side', ratings: 4.6 },
          { name: 'Milkshake', price: 140, description: 'Creamy vanilla milkshake', category: 'beverage', ratings: 4.5 },
          { name: 'Brownie', price: 100, description: 'Chocolate fudge brownie', category: 'dessert', ratings: 4.8 },
        ],
      },
      {
        name: 'Sushi Paradise',
        owner: owners[3]._id,
        description: 'Fresh sushi and Japanese delicacies prepared by expert chefs',
        cuisine: ['Sushi', 'Japanese', 'Asian'],
        rating: 4.8,
        reviewCount: 450,
        deliveryTime: 28,
        deliveryCharge: 60,
        minimumOrderValue: 400,
        items: [
          { name: 'California Roll', price: 380, description: 'Crab, avocado, cucumber', category: 'main', ratings: 4.7 },
          { name: 'Dragon Roll', price: 450, description: 'Shrimp tempura, avocado', category: 'main', ratings: 4.9 },
          { name: 'Vegetable Roll', price: 280, description: 'Fresh vegetables and rice', category: 'main', ratings: 4.5 },
          { name: 'Edamame', price: 150, description: 'Steamed soy beans', category: 'appetizer', ratings: 4.6 },
          { name: 'Miso Soup', price: 120, description: 'Traditional soy soup', category: 'appetizer', ratings: 4.4 },
          { name: 'Green Tea', price: 80, description: 'Hot green tea', category: 'beverage', ratings: 4.3 },
          { name: 'Mochi Ice Cream', price: 150, description: 'Japanese ice cream', category: 'dessert', ratings: 4.8 },
        ],
      },
      {
        name: 'China Kitchen',
        owner: owners[4]._id,
        description: 'Authentic Chinese cuisine with traditional cooking methods',
        cuisine: ['Chinese', 'Asian', 'Noodles'],
        rating: 4.5,
        reviewCount: 310,
        deliveryTime: 25,
        deliveryCharge: 35,
        minimumOrderValue: 180,
        items: [
          { name: 'Kung Pao Chicken', price: 280, description: 'Spicy chicken with peanuts', category: 'main', ratings: 4.6 },
          { name: 'Fried Rice', price: 200, description: 'Egg fried rice with vegetables', category: 'main', ratings: 4.5 },
          { name: 'Noodles', price: 220, description: 'Stir-fried noodles', category: 'main', ratings: 4.4 },
          { name: 'Spring Rolls', price: 140, description: 'Crispy vegetable rolls', category: 'appetizer', ratings: 4.7 },
          { name: 'Manchurian', price: 180, description: 'Fried balls in spicy sauce', category: 'appetizer', ratings: 4.5 },
          { name: 'Lemon Tea', price: 60, description: 'Refreshing lemon tea', category: 'beverage', ratings: 4.3 },
          { name: 'Fortune Cookie', price: 80, description: 'Sweet crispy cookie', category: 'dessert', ratings: 4.6 },
        ],
      },
      {
        name: 'Sweet Scoops',
        owner: owners[5]._id,
        description: 'Premium ice cream parlour with homemade flavours',
        cuisine: ['Desserts', 'Ice Cream', 'Cafe'],
        rating: 4.9,
        reviewCount: 620,
        deliveryTime: 15,
        deliveryCharge: 20,
        minimumOrderValue: 100,
        items: [
          { name: 'Vanilla Ice Cream', price: 120, description: 'Classic vanilla scoop', category: 'dessert', ratings: 4.7 },
          { name: 'Chocolate Ice Cream', price: 120, description: 'Rich chocolate flavor', category: 'dessert', ratings: 4.9 },
          { name: 'Strawberry Ice Cream', price: 120, description: 'Fresh strawberry', category: 'dessert', ratings: 4.6 },
          { name: 'Cookies & Cream', price: 150, description: 'Ice cream with cookie bits', category: 'dessert', ratings: 4.8 },
          { name: 'Brownie Sundae', price: 200, description: 'Brownie with ice cream', category: 'dessert', ratings: 4.9 },
          { name: 'Milkshake', price: 140, description: 'Creamy milkshake', category: 'beverage', ratings: 4.7 },
          { name: 'Cappuccino', price: 100, description: 'Hot cappuccino', category: 'beverage', ratings: 4.5 },
        ],
      },
    ];

    // Create restaurants and their menu items - only if they don't exist
    let totalMenuItems = 0;
    const restaurants = [];

    for (const restaurantData of restaurantsData) {
      const existingRestaurant = await Restaurant.findOne({ name: restaurantData.name });
      
      if (existingRestaurant) {
        console.log(`✓ Restaurant already exists: ${restaurantData.name}`);
        restaurants.push(existingRestaurant);
      } else {
        const { items, ...rest } = restaurantData;
        const restaurant = await Restaurant.create({
          ...rest,
          address: {
            street: '123 Main Street',
            city: 'Delhi',
            state: 'Delhi',
            zipCode: '110001',
            country: 'India',
          },
          phone: rest.phone || '9100000000',
          email: `info@${rest.name.toLowerCase().replace(' ', '')}@restaurant.com`,
        });

        // Create menu items for this restaurant
        const menuItems = await MenuItem.insertMany(
          items.map((item) => ({
            ...item,
            restaurant: restaurant._id,
            isAvailable: true,
          }))
        );

        restaurant.menu = menuItems.map((item) => item._id);
        await restaurant.save();

        restaurants.push(restaurant);
        totalMenuItems += menuItems.length;
        console.log(`✓ Created "${restaurant.name}" with ${menuItems.length} menu items`);
      }
    }

    console.log(`✓ Total menu items created: ${totalMenuItems}`);

    // Create sample orders
    const order = await Order.create({
      user: customer._id,
      restaurant: restaurants[0]._id,
      items: [
        {
          menuItem: (await MenuItem.findOne({ name: 'Butter Chicken' }))._id,
          quantity: 1,
          price: 320,
        },
        {
          menuItem: (await MenuItem.findOne({ name: 'Garlic Naan' }))._id,
          quantity: 2,
          price: 60,
        },
      ],
      subtotal: 440,
      deliveryCharge: 40,
      tax: 24,
      totalPrice: 504,
      status: 'delivered',
      deliveryAddress: {
        street: '456 Park Avenue',
        city: 'Delhi',
        state: 'Delhi',
        zipCode: '110002',
        phone: '9876543210',
      },
      paymentMethod: 'credit-card',
      paymentStatus: 'paid',
      rating: 5,
      review: 'Amazing food and quick delivery!',
    });
    console.log('✓ Created sample order:', order.orderNumber);

    console.log('\n✅ Database seeded successfully!\n');
    console.log(`📊 Summary:`);
    console.log(`   - ${restaurants.length} Restaurants Created`);
    console.log(`   - ${totalMenuItems} Menu Items Created`);
    console.log(`   - 1 Sample Order Created`);
    console.log('');
    console.log('🍽️  Restaurants:');
    restaurants.forEach((r) => console.log(`   - ${r.name}`));
    console.log('🔐 Sample login credentials:');
    console.log('');
    console.log('  Restaurant Owners:');
    console.log('    Raj Patel (Spice Kingdom)');
    console.log('      Email: raj@spicekingdom.com');
    console.log('      Password: password123');
    console.log('');
    console.log('    Marco Rossi (Pizza Parlour)');
    console.log('      Email: marco@pizzaparlour.com');
    console.log('      Password: password123');
    console.log('');
    console.log('    Alex Jordan (Burger Barn)');
    console.log('      Email: alex@burgerbarn.com');
    console.log('      Password: password123');
    console.log('');
    console.log('    Priya Sharma (Sushi Paradise)');
    console.log('      Email: priya@sushiparadise.com');
    console.log('      Password: password123');
    console.log('');
    console.log('    Wei Chen (China Kitchen)');
    console.log('      Email: wei@chinakitchen.com');
    console.log('      Password: password123');
    console.log('');
    console.log('    Raj Kumar (Sweet Scoops)');
    console.log('      Email: raj@sweetscoop.com');
    console.log('      Password: password123');
    console.log('');
    console.log('  Customer:');
    console.log('    Email: arjun@customer.com');
    console.log('    Password: password123');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

const main = async () => {
  await connectDB();
  await seedDatabase();
};

main();
