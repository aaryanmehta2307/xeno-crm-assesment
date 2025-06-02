const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config(); // Load environment variables

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY is not set in .env file');
}

// Delay helper for retry
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const callOpenAIWithRetries = async (prompt, retries = 3) => {
  console.log('🔁 Calling OpenAI API...');
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo-1106',
          messages: [
            {
              role: 'system',
              content:
                'Convert the user input to an array of rule objects in JSON format. Each rule should include "field", "operator", and "value". Supported fields: totalSpend, visits.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.2,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (err) {
      if (err.response?.status === 429 && i < retries - 1) {
        console.warn(`⚠️ Rate limit hit. Retrying in 2s... (${i + 1}/${retries})`);
        await delay(2000);
      } else {
        throw err;
      }
    }
  }
  throw new Error('Exceeded retry attempts due to rate limiting.');
};

router.post('/rules', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
   console.log('🟢 Received prompt:', prompt);
let aiResponse = await callOpenAIWithRetries(prompt);
console.log('🟢 Raw AI response:', aiResponse);
    // Clean AI output
    aiResponse = aiResponse.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('❌ Failed to parse AI response as JSON');
      console.error('AI Raw Output:', aiResponse);
      return res.status(500).json({ error: 'Invalid JSON returned by OpenAI' });
    }

    res.json({ rules: parsed });
  } catch (err) {
    console.error('❌ OpenAI API call failed:', err.message);
    res.status(500).json({ error: 'AI conversion failed' });
  }
});
// 📩 AI Message Suggestions Endpoint
router.post('/messages', async (req, res) => {
  const { goal } = req.body;

  const templates = {
    default: [
      "We miss you! Here's 10% off your next order.",
      "Still thinking it over? Here's a little nudge 🛍️",
      "Come back and enjoy exclusive deals!"
    ],
    inactive: [
      "Haven’t seen you in a while — come back for 15% off.",
      "Your favorites are waiting. Tap to return!",
      "We miss you! Here's something special inside."
    ],
    vip: [
      "Thanks for being a top customer — enjoy this exclusive deal!",
      "You’re a VIP 🎉 Grab your early-access reward!",
      "Premium treatment for premium shoppers. Enjoy 20% off!"
    ]
  };

  const selected =
    goal.toLowerCase().includes("inactive") ? templates.inactive :
    goal.toLowerCase().includes("vip") ? templates.vip :
    templates.default;

  res.json({ messages: selected });
});

module.exports = router;
