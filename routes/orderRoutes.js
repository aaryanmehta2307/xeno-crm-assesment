const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders } = require('../controllers/orderController');

router.post('/', createOrder);       // Create new order
router.get('/', getAllOrders);       // Get all orders

module.exports = router;
