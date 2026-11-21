const express = require('express');
const router = express.Router();
const {
  getInsight,
  getOverview,
  getAudience,
  getEngagement,
  updateMetrics,
  resetInsight,
  addCountry,
  deleteCountry
} = require('../controllers/insightController');

// Insights tab routes matching the exact screenshot screens
router.get('/:reelId/overview', getOverview);
router.get('/:reelId/audience', getAudience);
router.get('/:reelId/engagement', getEngagement);

// Full insight document endpoints
router.get('/:reelId', getInsight);
router.put('/:reelId', updateMetrics);
router.post('/:reelId/reset', resetInsight);

// Dynamic country endpoints
router.post('/:reelId/countries', addCountry);
router.delete('/:reelId/countries/:label', deleteCountry);

module.exports = router;
