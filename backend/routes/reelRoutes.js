const express = require('express');
const router = express.Router();
const {
  getAllReels,
  getReel,
  createReel,
  toggleLike,
  toggleBookmark,
  recordView,
  boostReel,
  updateReelSettings,
  getReelActions,
  executeAction,
  updateReel,
  repostReel,
  shareReel,
  getComments,
  addComment
} = require('../controllers/reelController');

// All reels for feed & create new reel
router.get('/', getAllReels);
router.post('/', createReel);

// Reel detail routes
router.get('/current', getReel);
router.get('/:id', getReel);
router.put('/:id', updateReel);

// Reel interaction routes
router.post('/:id/like', toggleLike);
router.post('/:id/bookmark', toggleBookmark);
router.post('/:id/view', recordView);
router.post('/:id/boost', boostReel);
router.post('/:id/repost', repostReel);
router.post('/:id/share', shareReel);

// Comments routes
router.get('/:id/comments', getComments);
router.post('/:id/comment', addComment);

// Action sheet routes (Image 4)
router.get('/:id/actions', getReelActions);
router.post('/:id/actions/:actionId', executeAction);
router.patch('/:id/settings', updateReelSettings);

module.exports = router;
