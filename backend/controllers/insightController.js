const Insight = require('../models/Insight');
const Reel = require('../models/Reel');
const { initialInsight, initialReel } = require('../seed');

const ensureInsight = async (reelId = 'reel_001') => {
  let insight = await Insight.findOne({ reelId });
  if (!insight) {
    insight = await Insight.create({ ...initialInsight, reelId });
  }
  let reel = await Reel.findOne({ reelId });
  if (!reel) {
    reel = await Reel.create({ ...initialReel, reelId });
  }
  return { insight, reel };
};

// @desc    Get complete insights for reel
// @route   GET /api/insights/:reelId
exports.getInsight = async (req, res, next) => {
  try {
    const reelId = req.params.reelId === 'current' || !req.params.reelId ? 'reel_001' : req.params.reelId;
    const { insight, reel } = await ensureInsight(reelId);

    res.status(200).json({
      success: true,
      data: {
        ...insight.toObject(),
        reelStats: {
          views: reel.views,
          likes: reel.likes,
          comments: reel.comments,
          reposts: reel.reposts,
          shares: reel.shares,
          bookmarks: reel.bookmarks,
          isLiked: reel.isLiked,
          isBookmarked: reel.isBookmarked
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Overview Tab metrics (Image 3)
// @route   GET /api/insights/:reelId/overview
exports.getOverview = async (req, res, next) => {
  try {
    const reelId = req.params.reelId === 'current' || !req.params.reelId ? 'reel_001' : req.params.reelId;
    const { insight, reel } = await ensureInsight(reelId);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          views: insight.overview.views || reel.views,
          accountsReached: insight.overview.accountsReached,
          averageWatchTime: insight.overview.averageWatchTime,
          follows: insight.overview.follows
        },
        viewFactors: {
          skipRate: insight.overview.skipRate,
          description: 'Rates are listed in order of importance to reach.'
        },
        quickStats: {
          likes: reel.likes,
          comments: reel.comments,
          reposts: reel.reposts,
          shares: reel.shares,
          bookmarks: reel.bookmarks
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Audience Tab demographics (Images 1 & 2)
// @route   GET /api/insights/:reelId/audience
exports.getAudience = async (req, res, next) => {
  try {
    const reelId = req.params.reelId === 'current' || !req.params.reelId ? 'reel_001' : req.params.reelId;
    const { insight } = await ensureInsight(reelId);

    res.status(200).json({
      success: true,
      data: {
        whoViewedYourReel: insight.audience.viewers,
        details: {
          countries: insight.audience.countries,
          ageRanges: insight.audience.ageRanges,
          genders: insight.audience.genders
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Engagement Tab metrics
// @route   GET /api/insights/:reelId/engagement
exports.getEngagement = async (req, res, next) => {
  try {
    const reelId = req.params.reelId === 'current' || !req.params.reelId ? 'reel_001' : req.params.reelId;
    const { insight, reel } = await ensureInsight(reelId);

    res.status(200).json({
      success: true,
      data: {
        accountsEngaged: insight.engagement.accountsEngaged,
        likes: reel.likes,
        comments: reel.comments,
        saves: reel.bookmarks,
        shares: reel.shares
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update metrics dynamically
// @route   PUT /api/insights/:reelId
exports.updateMetrics = async (req, res, next) => {
  try {
    const reelId = req.params.reelId === 'current' || !req.params.reelId ? 'reel_001' : req.params.reelId;
    const { insight, reel } = await ensureInsight(reelId);

    const { overview, audience, engagement } = req.body;

    if (overview) {
      insight.overview = { ...insight.overview.toObject(), ...overview };
      if (overview.views !== undefined) {
        reel.views = overview.views;
      }
    }

    if (audience) {
      if (audience.viewers) {
        insight.audience.viewers = { ...insight.audience.viewers.toObject(), ...audience.viewers };
      }
      if (audience.countries) insight.audience.countries = audience.countries;
      if (audience.ageRanges) insight.audience.ageRanges = audience.ageRanges;
      if (audience.genders) insight.audience.genders = audience.genders;
    }

    if (engagement) {
      insight.engagement = { ...insight.engagement.toObject(), ...engagement };
      if (engagement.likes !== undefined) reel.likes = engagement.likes;
      if (engagement.comments !== undefined) reel.comments = engagement.comments;
      if (engagement.saves !== undefined) reel.bookmarks = engagement.saves;
      if (engagement.shares !== undefined) reel.shares = engagement.shares;
      if (engagement.reposts !== undefined) reel.reposts = engagement.reposts;
    }

    // Also support direct reelStats if sent from frontend editor
    if (req.body.reelStats) {
      const stats = req.body.reelStats;
      if (stats.likes !== undefined) {
        reel.likes = stats.likes;
        insight.engagement.likes = stats.likes;
      }
      if (stats.comments !== undefined) {
        reel.comments = stats.comments;
        insight.engagement.comments = stats.comments;
      }
      if (stats.reposts !== undefined) reel.reposts = stats.reposts;
      if (stats.shares !== undefined) {
        reel.shares = stats.shares;
        insight.engagement.shares = stats.shares;
      }
      if (stats.bookmarks !== undefined) {
        reel.bookmarks = stats.bookmarks;
        insight.engagement.saves = stats.bookmarks;
      }
      if (stats.views !== undefined) {
        reel.views = stats.views;
        insight.overview.views = stats.views;
      }
    }

    await insight.save();
    await reel.save();

    res.status(200).json({
      success: true,
      message: 'Insights metrics updated successfully in MongoDB Atlas',
      data: {
        ...insight.toObject(),
        reelStats: {
          views: reel.views,
          likes: reel.likes,
          comments: reel.comments,
          reposts: reel.reposts,
          shares: reel.shares,
          bookmarks: reel.bookmarks
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset insights to default seed data
// @route   POST /api/insights/:reelId/reset
exports.resetInsight = async (req, res, next) => {
  try {
    const reelId = req.params.reelId === 'current' || !req.params.reelId ? 'reel_001' : req.params.reelId;
    const { initialInsights } = require('../seed');
    const defaultData = initialInsights.find(i => i.reelId === reelId) || initialInsights[0];

    let insight = await Insight.findOne({ reelId });
    if (!insight) {
      insight = await Insight.create({ ...defaultData, reelId });
    } else {
      insight.overview = defaultData.overview;
      insight.audience = defaultData.audience;
      insight.engagement = defaultData.engagement;
      await insight.save();
    }

    res.status(200).json({
      success: true,
      message: `Insights reset to default for ${reelId}`,
      data: insight
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add or update a country in audience demographics
// @route   POST /api/insights/:reelId/countries
exports.addCountry = async (req, res, next) => {
  try {
    const reelId = req.params.reelId === 'current' || !req.params.reelId ? 'reel_001' : req.params.reelId;
    const { insight } = await ensureInsight(reelId);

    const { label, percentage, color } = req.body;
    if (!label || !label.trim()) {
      return res.status(400).json({ success: false, message: 'Country name is required' });
    }

    const countryItem = {
      label: label.trim(),
      percentage: Number(percentage) || 10,
      color: color || 'magenta'
    };

    const existingIdx = insight.audience.countries.findIndex(
      c => c.label.toLowerCase() === countryItem.label.toLowerCase()
    );

    if (existingIdx >= 0) {
      insight.audience.countries[existingIdx].percentage = countryItem.percentage;
      insight.audience.countries[existingIdx].color = countryItem.color;
    } else {
      insight.audience.countries.push(countryItem);
    }

    await insight.save();

    res.status(201).json({
      success: true,
      message: `Country ${countryItem.label} added to demographics in MongoDB Atlas`,
      data: insight.audience.countries
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a country from audience demographics
// @route   DELETE /api/insights/:reelId/countries/:label
exports.deleteCountry = async (req, res, next) => {
  try {
    const reelId = req.params.reelId === 'current' || !req.params.reelId ? 'reel_001' : req.params.reelId;
    const { insight } = await ensureInsight(reelId);
    const countryLabel = req.params.label;

    insight.audience.countries = insight.audience.countries.filter(
      c => c.label.toLowerCase() !== countryLabel.toLowerCase()
    );

    await insight.save();

    res.status(200).json({
      success: true,
      message: `Country ${countryLabel} removed from MongoDB Atlas`,
      data: insight.audience.countries
    });
  } catch (error) {
    next(error);
  }
};
