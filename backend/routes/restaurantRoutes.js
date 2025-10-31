const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', restaurantController.getAllRestaurants);
router.get('/my-restaurants', authMiddleware, restaurantController.getRestaurantsByOwner);
router.get('/:id', restaurantController.getRestaurantById);
router.post('/', authMiddleware, restaurantController.createRestaurant);
router.put('/:id', authMiddleware, restaurantController.updateRestaurant);
router.delete('/:id', authMiddleware, restaurantController.deleteRestaurant);

module.exports = router;
