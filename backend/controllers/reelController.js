const Reel = require('../models/Reel');
const Insight = require('../models/Insight');
const { initialReel, initialReels, initialInsight } = require('../seed');

// Helper to ensure a default reel exists
const ensureDefaultReel = async (reelId = 'reel_001') => {
  let reel = await Reel.findOne({ reelId });
  if (!reel) {
    reel = await Reel.create(initialReel);
  }
  let insight = await Insight.findOne({ reelId });
  if (!insight) {
    insight = await Insight.create(initialInsight);
  }
  return { reel, insight };
};

// @desc    Get all reels for continuous scrolling feed
// @route   GET /api/reels
exports.getAllReels = async (req, res, next) => {
  try {
    let reels = await Reel.find();
    if (!reels || reels.length === 0) {
      reels = await Reel.insertMany(initialReels);
    }
    res.status(200).json({
      success: true,
      count: reels.length,
      data: reels
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reel details
// @route   GET /api/reels/:id or GET /api/reels/current
exports.getReel = async (req, res, next) => {
  try {
    const reelId = req.params.id === 'current' || !req.params.id ? 'reel_001' : req.params.id;
    const { reel } = await ensureDefaultReel(reelId);

    res.status(200).json({
      success: true,
      data: reel
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle like state & update count
// @route   POST /api/reels/:id/like
exports.toggleLike = async (req, res, next) => {
  try {
    const reelId = req.params.id === 'current' ? 'reel_001' : req.params.id;
    const { reel, insight } = await ensureDefaultReel(reelId);

    const isLiked = !reel.isLiked;
    const newLikes = isLiked ? reel.likes + 1 : Math.max(0, reel.likes - 1);

    reel.isLiked = isLiked;
    reel.likes = newLikes;
    await reel.save();

    // Also update insight engagement
    if (insight) {
      insight.engagement.likes = newLikes;
      await insight.save();
    }

    res.status(200).json({
      success: true,
      message: isLiked ? 'Reel liked' : 'Reel unliked',
      data: {
        isLiked: reel.isLiked,
        likes: reel.likes
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle bookmark / save state
// @route   POST /api/reels/:id/bookmark
exports.toggleBookmark = async (req, res, next) => {
  try {
    const reelId = req.params.id === 'current' ? 'reel_001' : req.params.id;
    const { reel, insight } = await ensureDefaultReel(reelId);

    const isBookmarked = !reel.isBookmarked;
    const newBookmarks = isBookmarked ? reel.bookmarks + 1 : Math.max(0, reel.bookmarks - 1);

    reel.isBookmarked = isBookmarked;
    reel.bookmarks = newBookmarks;
    await reel.save();

    // Also update insight engagement
    if (insight) {
      insight.engagement.saves = newBookmarks;
      await insight.save();
    }

    res.status(200).json({
      success: true,
      message: isBookmarked ? 'Saved to collection' : 'Removed from collection',
      data: {
        isBookmarked: reel.isBookmarked,
        bookmarks: reel.bookmarks
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Record reel view & increment counter
// @route   POST /api/reels/:id/view
exports.recordView = async (req, res, next) => {
  try {
    const reelId = req.params.id === 'current' ? 'reel_001' : req.params.id;
    const { reel, insight } = await ensureDefaultReel(reelId);

    reel.views += 1;
    await reel.save();

    if (insight) {
      insight.overview.views += 1;
      // Reached accounts proportionally updates
      if (reel.views % 2 === 0) {
        insight.overview.accountsReached += 1;
      }
      await insight.save();
    }

    res.status(200).json({
      success: true,
      data: {
        views: reel.views,
        accountsReached: insight ? insight.overview.accountsReached : null
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Boost post / reel
// @route   POST /api/reels/:id/boost
exports.boostReel = async (req, res, next) => {
  try {
    const reelId = req.params.id === 'current' ? 'reel_001' : req.params.id;
    const { reel } = await ensureDefaultReel(reelId);

    reel.isBoosted = true;
    await reel.save();

    res.status(200).json({
      success: true,
      message: 'Reel boost initiated successfully',
      data: reel
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update reel action sheet settings
// @route   PATCH /api/reels/:id/settings
exports.updateReelSettings = async (req, res, next) => {
  try {
    const reelId = req.params.id === 'current' ? 'reel_001' : req.params.id;
    const { reel } = await ensureDefaultReel(reelId);

    reel.settings = {
      ...reel.settings.toObject(),
      ...req.body
    };
    await reel.save();

    res.status(200).json({
      success: true,
      message: 'Reel settings updated',
      data: reel.settings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get action sheet items list (20 items matching Instagram specs)
// @route   GET /api/reels/:id/actions
exports.getReelActions = async (req, res) => {
  const actions = [
    { id: 'save', label: 'Save', icon: 'bookmark' },
    { id: 'remix', label: 'Remix', icon: 'camera-remix' },
    { id: 'boost', label: 'Boost reel', icon: 'trending-up', isPrimary: true },
    { id: 'qr', label: 'QR code', icon: 'qr-code' },
    { id: 'archive', label: 'Archive', icon: 'archive' },
    { id: 'hide-likes', label: 'Hide like count to others', icon: 'heart-slash' },
    { id: 'hide-shares', label: 'Hide share count', icon: 'share-slash' },
    { id: 'turn-off-commenting', label: 'Turn off commenting', icon: 'comment-slash' },
    { id: 'suggested-products', label: 'Suggested products', icon: 'shopping-bag' },
    { id: 'turn-off-downloading', label: 'Turn off downloading', icon: 'download-slash' },
    { id: 'edit', label: 'Edit', icon: 'edit' },
    { id: 'adjust-preview', label: 'Adjust preview', icon: 'crop' },
    { id: 'view-insights', label: 'View insights', icon: 'chart-bar' },
    { id: 'content-ad-labels', label: 'Content & ad labels', icon: 'content-ad-labels' },
    { id: 'turn-off-reuse', label: 'Turn off reuse', icon: 'ban' },
    { id: 'remove-main-grid', label: 'Remove from main grid', icon: 'minus-circle' },
    { id: 'pin-main-grid', label: 'Pin to your main grid', icon: 'pin' },
    { id: 'translations', label: 'Translations', icon: 'translations' },
    { id: 'closed-captions', label: 'Closed Captions', icon: 'closed-captions' },
    { id: 'delete', label: 'Delete', icon: 'trash', isDestructive: true }
  ];

  res.status(200).json({
    success: true,
    data: actions
  });
};

// @desc    Trigger action from action sheet
// @route   POST /api/reels/:id/actions/:actionId
exports.executeAction = async (req, res, next) => {
  try {
    const { actionId } = req.params;
    const reelId = req.params.id === 'current' ? 'reel_001' : req.params.id;
    const { reel } = await ensureDefaultReel(reelId);

    let responseMessage = `Action executed: ${actionId}`;

    switch (actionId) {
      case 'save':
        reel.isBookmarked = !reel.isBookmarked;
        responseMessage = reel.isBookmarked ? 'Saved to collection' : 'Removed from collection';
        break;
      case 'remix':
        responseMessage = 'Remix studio opened for this reel';
        break;
      case 'boost':
        reel.isBoosted = true;
        responseMessage = 'Ad campaign setup initiated for this reel';
        break;
      case 'qr':
        responseMessage = 'QR code generated for this reel';
        break;
      case 'archive':
        reel.settings.isArchived = !reel.settings.isArchived;
        responseMessage = reel.settings.isArchived ? 'Reel archived' : 'Reel unarchived';
        break;
      case 'hide-likes':
        reel.settings.hideLikeCount = !reel.settings.hideLikeCount;
        responseMessage = reel.settings.hideLikeCount ? 'Like count hidden from others' : 'Like count visible to others';
        break;
      case 'hide-shares':
        reel.settings.hideShareCount = !reel.settings.hideShareCount;
        responseMessage = reel.settings.hideShareCount ? 'Share count hidden' : 'Share count visible';
        break;
      case 'turn-off-commenting':
        reel.settings.commentsDisabled = !reel.settings.commentsDisabled;
        responseMessage = reel.settings.commentsDisabled ? 'Commenting turned off' : 'Commenting turned on';
        break;
      case 'suggested-products':
        responseMessage = 'Product tagging catalogue opened';
        break;
      case 'turn-off-downloading':
        reel.settings.downloadsDisabled = !reel.settings.downloadsDisabled;
        responseMessage = reel.settings.downloadsDisabled ? 'Downloading turned off' : 'Downloading allowed';
        break;
      case 'edit':
        responseMessage = 'Reel editor opened';
        break;
      case 'adjust-preview':
        responseMessage = 'Adjust cover and preview frame opened';
        break;
      case 'view-insights':
        responseMessage = 'Reel insights opened';
        break;
      case 'content-ad-labels':
        responseMessage = 'Branded content & ad disclosures opened';
        break;
      case 'turn-off-reuse':
        reel.settings.reuseDisabled = !reel.settings.reuseDisabled;
        responseMessage = reel.settings.reuseDisabled ? 'Reuse turned off' : 'Reuse allowed';
        break;
      case 'remove-main-grid':
        reel.settings.removedFromGrid = !reel.settings.removedFromGrid;
        responseMessage = reel.settings.removedFromGrid ? 'Removed from main profile grid' : 'Restored to main profile grid';
        break;
      case 'pin-main-grid':
        responseMessage = 'Reel pinned to top of your profile grid';
        break;
      case 'translations':
        responseMessage = 'Automatic captions translations enabled';
        break;
      case 'closed-captions':
        responseMessage = 'Closed Captions toggled';
        break;
      case 'delete':
        responseMessage = 'Reel deleted from your profile';
        break;
      default:
        responseMessage = `Processed action: ${actionId}`;
    }

    await reel.save();

    res.status(200).json({
      success: true,
      message: responseMessage,
      data: reel
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new reel / post
// @route   POST /api/reels
exports.createReel = async (req, res, next) => {
  try {
    const {
      username,
      userAvatar,
      audioTitle,
      thumbnailUrl,
      videoUrl,
      caption,
      views,
      likes
    } = req.body;

    const count = await Reel.countDocuments();
    const reelId = `reel_${String(count + 1).padStart(3, '0')}_${Date.now().toString().slice(-4)}`;

    const newReel = await Reel.create({
      reelId,
      username: username || 'duo_brothers_65',
      userAvatar: userAvatar || '/assets/avatar.jpg',
      audioTitle: audioTitle || 'Original Audio',
      thumbnailUrl: thumbnailUrl || '/assets/gym_reel_video.jpg',
      videoUrl: videoUrl || thumbnailUrl || '/assets/gym_reel_video.jpg',
      caption: caption || 'New Reel Post ✨',
      views: Number(views) || 0,
      likes: Number(likes) || 0,
      comments: 0,
      reposts: 0,
      shares: 0,
      bookmarks: 0,
      isLiked: false,
      isBookmarked: false,
      isBoosted: false
    });

    // Create corresponding Insight document in MongoDB Atlas
    await Insight.create({
      reelId,
      overview: {
        views: newReel.views,
        accountsReached: Math.round(newReel.views * 0.85),
        averageWatchTime: '7s',
        follows: 0,
        skipRate: 35.0
      },
      audience: {
        viewers: {
          followers: 45.0,
          nonFollowers: 55.0
        },
        countries: [
          { label: 'India', percentage: 100, color: 'magenta' }
        ],
        ageRanges: [
          { label: '18-24', percentage: 65, color: 'magenta' },
          { label: '25-34', percentage: 35, color: 'magenta' }
        ],
        genders: [
          { label: 'Men', percentage: 60, color: 'magenta' },
          { label: 'Women', percentage: 40, color: 'purple' }
        ]
      },
      engagement: {
        accountsEngaged: newReel.likes,
        likes: newReel.likes,
        comments: 0,
        saves: 0,
        shares: 0
      }
    });

    res.status(201).json({
      success: true,
      message: 'New reel created successfully in MongoDB Atlas',
      data: newReel
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update reel data dynamically
// @route   PUT /api/reels/:id
exports.updateReel = async (req, res, next) => {
  try {
    const reelId = req.params.id === 'current' ? 'reel_001' : req.params.id;
    const { reel, insight } = await ensureDefaultReel(reelId);

    const allowedFields = [
      'username', 'userAvatar', 'audioTitle', 'thumbnailUrl', 'videoUrl',
      'caption', 'views', 'likes', 'comments', 'reposts', 'shares', 'bookmarks',
      'isLiked', 'isBookmarked', 'isBoosted', 'settings'
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        reel[field] = req.body[field];
      }
    });

    await reel.save();

    // Sync insight if views or metrics changed
    if (insight) {
      if (req.body.views !== undefined) insight.overview.views = req.body.views;
      if (req.body.likes !== undefined) insight.engagement.likes = req.body.likes;
      if (req.body.comments !== undefined) insight.engagement.comments = req.body.comments;
      if (req.body.bookmarks !== undefined) insight.engagement.saves = req.body.bookmarks;
      if (req.body.shares !== undefined) insight.engagement.shares = req.body.shares;
      await insight.save();
    }

    res.status(200).json({
      success: true,
      message: 'Reel updated successfully in MongoDB Atlas',
      data: reel
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Increment / toggle repost
// @route   POST /api/reels/:id/repost
exports.repostReel = async (req, res, next) => {
  try {
    const reelId = req.params.id === 'current' ? 'reel_001' : req.params.id;
    const { reel } = await ensureDefaultReel(reelId);

    reel.reposts += 1;
    await reel.save();

    res.status(200).json({
      success: true,
      message: 'Reel reposted to your profile',
      data: { reposts: reel.reposts }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Increment share count
// @route   POST /api/reels/:id/share
exports.shareReel = async (req, res, next) => {
  try {
    const reelId = req.params.id === 'current' ? 'reel_001' : req.params.id;
    const { reel, insight } = await ensureDefaultReel(reelId);

    reel.shares += 1;
    await reel.save();

    if (insight) {
      insight.engagement.shares = reel.shares;
      await insight.save();
    }

    res.status(200).json({
      success: true,
      message: 'Reel shared',
      data: { shares: reel.shares }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments for a reel
// @route   GET /api/reels/:id/comments
exports.getComments = async (req, res, next) => {
  try {
    const reelId = req.params.id === 'current' ? 'reel_001' : req.params.id;
    const { reel } = await ensureDefaultReel(reelId);

    res.status(200).json({
      success: true,
      count: reel.commentsList ? reel.commentsList.length : 0,
      data: reel.commentsList || []
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a comment to reel
// @route   POST /api/reels/:id/comment
exports.addComment = async (req, res, next) => {
  try {
    const reelId = req.params.id === 'current' ? 'reel_001' : req.params.id;
    const { reel, insight } = await ensureDefaultReel(reelId);

    const { text, username } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const newComment = {
      username: username || 'you',
      avatar: '/assets/avatar.jpg',
      text: text.trim(),
      likes: 0,
      createdAt: new Date()
    };

    if (!reel.commentsList) {
      reel.commentsList = [];
    }
    reel.commentsList.unshift(newComment);
    reel.comments = reel.commentsList.length;
    await reel.save();

    if (insight) {
      insight.engagement.comments = reel.comments;
      await insight.save();
    }

    res.status(201).json({
      success: true,
      message: 'Comment posted',
      data: {
        comment: newComment,
        commentsCount: reel.comments
      }
    });
  } catch (error) {
    next(error);
  }
};
