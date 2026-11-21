const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema(
  {
    reelId: {
      type: String,
      required: true,
      unique: true,
      default: 'reel_001'
    },
    username: {
      type: String,
      required: true,
      default: 'duo_brothers_65'
    },
    userAvatar: {
      type: String,
      default: '/assets/avatar.jpg'
    },
    audioTitle: {
      type: String,
      default: 'duo_brothers_65 · Original audio (may include au...'
    },
    thumbnailUrl: {
      type: String,
      default: '/assets/reel_thumb.jpg'
    },
    videoUrl: {
      type: String,
      default: '/assets/reel_video.jpg'
    },
    views: {
      type: Number,
      default: 260
    },
    likes: {
      type: Number,
      default: 2
    },
    comments: {
      type: Number,
      default: 0
    },
    reposts: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    bookmarks: {
      type: Number,
      default: 0
    },
    isLiked: {
      type: Boolean,
      default: false
    },
    isBookmarked: {
      type: Boolean,
      default: false
    },
    isBoosted: {
      type: Boolean,
      default: false
    },
    // User comments list
    commentsList: [
      {
        username: { type: String, default: 'instagram_user' },
        avatar: { type: String, default: '/assets/avatar.jpg' },
        text: { type: String, required: true },
        likes: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    // Reel Settings from Action Sheet (Image 4)
    settings: {
      hideLikeCount: { type: Boolean, default: false },
      hideShareCount: { type: Boolean, default: false },
      commentsDisabled: { type: Boolean, default: false },
      downloadsDisabled: { type: Boolean, default: false },
      reuseDisabled: { type: Boolean, default: false },
      isArchived: { type: Boolean, default: false },
      removedFromGrid: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reel', reelSchema);
