// Load Environment Variables
require('dotenv').config();

// Core Modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Express App Initialization
const app = express();
const PORT = process.env.PORT || 5000;

// ======= MIDDLEWARE =======
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// ======= ROUTES =======
app.get('/', (req, res) => {
  res.send('🚀 Xeno CRM API Running');
});

// API Routes
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const segmentRoutes = require('./routes/segmentRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const aiRoutes = require('./routes/aiRoutes');

app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/segments', segmentRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/ai', aiRoutes);

// ======= DATABASE & SERVER INIT =======
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🌐 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });
