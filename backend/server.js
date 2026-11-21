const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { seedData } = require('./seed');

// Route files
const reelRoutes = require('./routes/reelRoutes');
const insightRoutes = require('./routes/insightRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Instagram Clone Backend API',
    mongoConnected: require('mongoose').connection.readyState === 1
  });
});

// Seed endpoint to easily re-initialize exact screenshot data
app.post('/api/seed', async (req, res, next) => {
  try {
    const Reel = require('./models/Reel');
    const Insight = require('./models/Insight');
    const { initialReel, initialInsight } = require('./seed');

    await Reel.deleteMany({ reelId: 'reel_001' });
    await Insight.deleteMany({ reelId: 'reel_001' });

    const reel = await Reel.create(initialReel);
    const insight = await Insight.create(initialInsight);

    res.status(200).json({
      success: true,
      message: 'Database seeded with screenshot data successfully',
      data: { reel, insight }
    });
  } catch (error) {
    next(error);
  }
});

// Mount Routes
app.use('/api/reels', reelRoutes);
app.use('/api/insights', insightRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Instagram Clone API is running on Node.js + MongoDB Atlas');
});

// Centralized Error Handler
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Instagram Clone Server running on port ${PORT}`);
    console.log(`📡 Endpoints available:`);
    console.log(`   - GET  /api/health`);
    console.log(`   - GET  /api/reels/current`);
    console.log(`   - POST /api/reels/:id/like`);
    console.log(`   - POST /api/reels/:id/bookmark`);
    console.log(`   - POST /api/reels/:id/view`);
    console.log(`   - GET  /api/reels/:id/actions`);
    console.log(`   - GET  /api/insights/:reelId/overview`);
    console.log(`   - GET  /api/insights/:reelId/audience`);
    console.log(`   - GET  /api/insights/:reelId/engagement`);
  });
}

module.exports = app;
