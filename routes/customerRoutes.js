const express = require('express');
const router = express.Router();

// ✅ Import both controller functions here
const { createCustomer, getAllCustomers } = require('../controllers/customerController');

// POST /api/customers → to create new customer
router.post('/', createCustomer);

// GET /api/customers → to fetch all customers
router.get('/', getAllCustomers);

module.exports = router;
