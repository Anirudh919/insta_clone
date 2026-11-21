const mongoose = require('mongoose');

const breakdownItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    percentage: { type: Number, required: true },
    color: { type: String, default: 'magenta' }
  },
  { _id: false }
);

const insightSchema = new mongoose.Schema(
  {
    reelId: {
      type: String,
      required: true,
      unique: true,
      ref: 'Reel'
    },
    // Screen 3: Overview Tab Metrics
    overview: {
      views: { type: Number, default: 260 },
      accountsReached: { type: Number, default: 223 },
      averageWatchTime: { type: String, default: '5s' },
      follows: { type: Number, default: 0 },
      skipRate: { type: Number, default: 55.9 }
    },
    // Screen 1 & 2: Audience Tab Metrics
    audience: {
      viewers: {
        followers: { type: Number, default: 50.8 },
        nonFollowers: { type: Number, default: 49.2 }
      },
      // Country Demographics (Image 1: India 100%)
      countries: [breakdownItemSchema],
      // Age Demographics (Image 2: 18-24 100%, others 0%)
      ageRanges: [breakdownItemSchema],
      // Gender Demographics (Men, Women)
      genders: [breakdownItemSchema]
    },
    // Engagement Tab Metrics
    engagement: {
      accountsEngaged: { type: Number, default: 2 },
      likes: { type: Number, default: 2 },
      comments: { type: Number, default: 0 },
      saves: { type: Number, default: 0 },
      shares: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Insight', insightSchema);
