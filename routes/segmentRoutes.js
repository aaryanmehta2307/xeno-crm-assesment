const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const mongoose = require('mongoose');

router.post('/preview', async (req, res) => {
  try {
    const rules = req.body.rules;

    const matchStage = [];

    rules.forEach(rule => {
      const value = parseFloat(rule.value);
      if (rule.field === 'totalSpend') {
        // We'll filter after grouping
      } else {
        // Push direct customer field filters
        if (rule.operator === '>') matchStage.push({ [rule.field]: { $gt: value } });
        if (rule.operator === '<') matchStage.push({ [rule.field]: { $lt: value } });
        if (rule.operator === '==') matchStage.push({ [rule.field]: value });
      }
    });

    const agg = [
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'customerId',
          as: 'orders'
        }
      },
      {
        $addFields: {
          totalSpend: { $sum: '$orders.amount' }
        }
      },
      {
        $match: {
          ...(matchStage.length > 0 ? { $and: matchStage } : {})
        }
      }
    ];

    // Now apply totalSpend filter
    rules.forEach(rule => {
      const value = parseFloat(rule.value);
      if (rule.field === 'totalSpend') {
        if (rule.operator === '>') agg.push({ $match: { totalSpend: { $gt: value } } });
        if (rule.operator === '<') agg.push({ $match: { totalSpend: { $lt: value } } });
        if (rule.operator === '==') agg.push({ $match: { totalSpend: value } });
      }
    });

    const result = await Customer.aggregate(agg);
    res.json({ audienceSize: result.length });

  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});


module.exports = router;
