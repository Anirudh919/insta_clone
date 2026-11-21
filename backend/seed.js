const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const Reel = require('./models/Reel');
const Insight = require('./models/Insight');
const connectDB = require('./config/db');

const initialReels = [
  {
    reelId: 'reel_001',
    username: 'duo_brothers_65',
    userAvatar: '/assets/avatar.jpg',
    audioTitle: 'Vikram Sarkar · Naam Chale',
    thumbnailUrl: '/assets/gym_reel_video.jpg',
    videoUrl: '/assets/gym_reel_video.jpg',
    views: 170,
    likes: 2,
    comments: 0,
    reposts: 0,
    shares: 0,
    bookmarks: 0,
    isLiked: false,
    isBookmarked: false,
    isBoosted: false,
    caption: 'Late night gym grind 💪🔥 Vikram Sarkar · Naam Chale',
    settings: {
      hideLikeCount: false,
      hideShareCount: false,
      commentsDisabled: false,
      downloadsDisabled: false,
      reuseDisabled: false,
      isArchived: false,
      removedFromGrid: false
    }
  },
  {
    reelId: 'reel_002',
    username: 'tech_gadget_zone',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
    audioTitle: 'tech_gadget_zone · Trending Cyber Beat',
    thumbnailUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=400&auto=format&fit=crop',
    videoUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop',
    views: 1420,
    likes: 89,
    comments: 14,
    reposts: 4,
    shares: 18,
    bookmarks: 31,
    isLiked: false,
    isBookmarked: false,
    isBoosted: false,
    caption: 'This pocket spinner is surprisingly fast! ⚡ Review coming tomorrow.',
    settings: {
      hideLikeCount: false,
      hideShareCount: false,
      commentsDisabled: false,
      downloadsDisabled: false,
      reuseDisabled: false,
      isArchived: false,
      removedFromGrid: false
    }
  },
  {
    reelId: 'reel_003',
    username: 'wanderlust_nomad',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop',
    audioTitle: 'Arctic Vibes · Original Chill Sound',
    thumbnailUrl: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=400&auto=format&fit=crop',
    videoUrl: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=800&auto=format&fit=crop',
    views: 3840,
    likes: 342,
    comments: 28,
    reposts: 15,
    shares: 64,
    bookmarks: 95,
    isLiked: false,
    isBookmarked: false,
    isBoosted: false,
    caption: 'Lost in the winter wonderland. The silence here is unmatched ✨',
    settings: {
      hideLikeCount: false,
      hideShareCount: false,
      commentsDisabled: false,
      downloadsDisabled: false,
      reuseDisabled: false,
      isArchived: false,
      removedFromGrid: false
    }
  },
  {
    reelId: 'reel_004',
    username: 'urban_lens_captures',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop',
    audioTitle: 'Midnight Tokyo · Lo-Fi Beats',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop',
    videoUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop',
    views: 5920,
    likes: 614,
    comments: 45,
    reposts: 33,
    shares: 112,
    bookmarks: 180,
    isLiked: false,
    isBookmarked: false,
    isBoosted: false,
    caption: 'Neon nights & city reflections. Shot on 35mm f/1.4 🔥',
    settings: {
      hideLikeCount: false,
      hideShareCount: false,
      commentsDisabled: false,
      downloadsDisabled: false,
      reuseDisabled: false,
      isArchived: false,
      removedFromGrid: false
    }
  },
  {
    reelId: 'reel_005',
    username: 'creative_visuals_lab',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
    audioTitle: 'Bass Drop Magic · Audio Original',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&auto=format&fit=crop',
    videoUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop',
    views: 8100,
    likes: 920,
    comments: 63,
    reposts: 54,
    shares: 230,
    bookmarks: 310,
    isLiked: false,
    isBookmarked: false,
    isBoosted: false,
    caption: 'Spinning orb illusion in natural golden hour light! What do you think?',
    settings: {
      hideLikeCount: false,
      hideShareCount: false,
      commentsDisabled: false,
      downloadsDisabled: false,
      reuseDisabled: false,
      isArchived: false,
      removedFromGrid: false
    }
  }
];

const initialInsights = [
  {
    reelId: 'reel_001',
    overview: {
      views: 265,
      accountsReached: 223,
      averageWatchTime: '5s',
      follows: 0,
      skipRate: 55.9
    },
    audience: {
      viewers: {
        followers: 50.8,
        nonFollowers: 49.2
      },
      countries: [
        { label: 'India', percentage: 100, color: 'magenta' }
      ],
      ageRanges: [
        { label: '13-17', percentage: 0, color: 'gray' },
        { label: '18-24', percentage: 100, color: 'magenta' },
        { label: '25-34', percentage: 0, color: 'gray' },
        { label: '35-44', percentage: 0, color: 'gray' },
        { label: '45-54', percentage: 0, color: 'gray' },
        { label: '55-64', percentage: 0, color: 'gray' },
        { label: '65+', percentage: 0, color: 'gray' }
      ],
      genders: [
        { label: 'Men', percentage: 84.5, color: 'magenta' },
        { label: 'Women', percentage: 15.5, color: 'purple' }
      ]
    },
    engagement: {
      accountsEngaged: 2,
      likes: 2,
      comments: 0,
      saves: 0,
      shares: 0
    }
  },
  {
    reelId: 'reel_002',
    overview: {
      views: 1420,
      accountsReached: 1190,
      averageWatchTime: '8s',
      follows: 12,
      skipRate: 38.2
    },
    audience: {
      viewers: {
        followers: 32.5,
        nonFollowers: 67.5
      },
      countries: [
        { label: 'India', percentage: 72, color: 'magenta' },
        { label: 'United States', percentage: 18, color: 'blue' },
        { label: 'United Kingdom', percentage: 10, color: 'purple' }
      ],
      ageRanges: [
        { label: '13-17', percentage: 15, color: 'blue' },
        { label: '18-24', percentage: 65, color: 'magenta' },
        { label: '25-34', percentage: 20, color: 'purple' }
      ],
      genders: [
        { label: 'Men', percentage: 78, color: 'magenta' },
        { label: 'Women', percentage: 22, color: 'purple' }
      ]
    },
    engagement: {
      accountsEngaged: 114,
      likes: 89,
      comments: 14,
      saves: 31,
      shares: 18
    }
  },
  {
    reelId: 'reel_003',
    overview: {
      views: 3840,
      accountsReached: 3120,
      averageWatchTime: '12s',
      follows: 45,
      skipRate: 24.1
    },
    audience: {
      viewers: {
        followers: 41.0,
        nonFollowers: 59.0
      },
      countries: [
        { label: 'India', percentage: 65, color: 'magenta' },
        { label: 'Canada', percentage: 25, color: 'blue' },
        { label: 'Norway', percentage: 10, color: 'purple' }
      ],
      ageRanges: [
        { label: '18-24', percentage: 45, color: 'magenta' },
        { label: '25-34', percentage: 40, color: 'purple' },
        { label: '35-44', percentage: 15, color: 'blue' }
      ],
      genders: [
        { label: 'Men', percentage: 52, color: 'magenta' },
        { label: 'Women', percentage: 48, color: 'purple' }
      ]
    },
    engagement: {
      accountsEngaged: 410,
      likes: 342,
      comments: 28,
      saves: 95,
      shares: 64
    }
  },
  {
    reelId: 'reel_004',
    overview: {
      views: 5920,
      accountsReached: 4980,
      averageWatchTime: '14s',
      follows: 82,
      skipRate: 19.5
    },
    audience: {
      viewers: {
        followers: 28.4,
        nonFollowers: 71.6
      },
      countries: [
        { label: 'India', percentage: 55, color: 'magenta' },
        { label: 'Japan', percentage: 30, color: 'blue' },
        { label: 'Germany', percentage: 15, color: 'purple' }
      ],
      ageRanges: [
        { label: '18-24', percentage: 58, color: 'magenta' },
        { label: '25-34', percentage: 35, color: 'purple' },
        { label: '35-44', percentage: 7, color: 'blue' }
      ],
      genders: [
        { label: 'Men', percentage: 62, color: 'magenta' },
        { label: 'Women', percentage: 38, color: 'purple' }
      ]
    },
    engagement: {
      accountsEngaged: 760,
      likes: 614,
      comments: 45,
      saves: 180,
      shares: 112
    }
  },
  {
    reelId: 'reel_005',
    overview: {
      views: 8100,
      accountsReached: 7200,
      averageWatchTime: '16s',
      follows: 115,
      skipRate: 15.3
    },
    audience: {
      viewers: {
        followers: 22.0,
        nonFollowers: 78.0
      },
      countries: [
        { label: 'India', percentage: 80, color: 'magenta' },
        { label: 'United States', percentage: 12, color: 'magenta' },
        { label: 'Brazil', percentage: 8, color: 'magenta' }
      ],
      ageRanges: [
        { label: '13-17', percentage: 22, color: 'magenta' },
        { label: '18-24', percentage: 60, color: 'magenta' },
        { label: '25-34', percentage: 18, color: 'magenta' }
      ],
      genders: [
        { label: 'Men', percentage: 70, color: 'magenta' },
        { label: 'Women', percentage: 30, color: 'purple' }
      ]
    },
    engagement: {
      accountsEngaged: 1180,
      likes: 920,
      comments: 63,
      saves: 310,
      shares: 230
    }
  }
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing reels and insights data...');
    await Reel.deleteMany({});
    await Insight.deleteMany({});

    console.log('Seeding multiple Reels into MongoDB Atlas...');
    const createdReels = await Reel.insertMany(initialReels);
    console.log(`Seeded ${createdReels.length} reels.`);

    console.log('Seeding corresponding Insights into MongoDB Atlas...');
    const createdInsights = await Insight.insertMany(initialInsights);
    console.log(`Seeded ${createdInsights.length} insight documents.`);

    console.log('✅ Database successfully seeded with multiple feed posts!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = { initialReel: initialReels[0], initialReels, initialInsight: initialInsights[0], initialInsights, seedData };
