// backend/routes/campaignRoutes.js

const express = require('express');
const router = express.Router();

const axios = require('axios'); // ✅ Required to make HTTP requests to our own backend

const Campaign = require('../models/Campaign');
const Customer = require('../models/Customer');
const CommunicationLog = require('../models/CommunicationLog');

// ✅ Save a new campaign
router.post('/', async (req, res) => {
  try {
    const { rules, audienceSize } = req.body;
    const newCampaign = new Campaign({ rules, audienceSize });
    await newCampaign.save();
    res.status(201).json(newCampaign);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get all saved campaigns
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Simulate campaign delivery (dummy vendor API)
router.post('/deliver/:campaignId', async (req, res) => {
  const campaignId = req.params.campaignId;

  try {
    const campaign = await Campaign.findById(campaignId);
    const customers = await Customer.find();

    for (const customer of customers) {
      const isSuccess = Math.random() < 0.9; // 90% success rate

      await axios.post('http://localhost:5000/api/campaigns/receipt', {
        campaignId,
        customerId: customer._id,
        status: isSuccess ? 'SENT' : 'FAILED',
        message: `Hi ${customer.name}, here’s 10% off on your next order!`
      });
    }

    res.json({ message: 'Delivery simulation complete.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delivery receipt handler (updates communication log)
router.post('/receipt', async (req, res) => {
  try {
    const { campaignId, customerId, status, message } = req.body;

    const log = new CommunicationLog({
      campaignId,
      customerId,
      status,
      message
    });

    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// ✅ Get all communication logs
router.get('/logs', async (req, res) => {
  try {
    const logs = await CommunicationLog.find()
      .sort({ timestamp: -1 })
      .populate('customerId', 'name');
    
    const withCustomerNames = logs.map(log => ({
      ...log.toObject(),
      customerName: log.customerId?.name || 'N/A'
    }));

    res.json(withCustomerNames);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;