export interface ReelStats {
  id: string;
  username: string;
  userAvatar: string;
  audioTitle: string;
  thumbnailUrl: string;
  videoUrl?: string;
  caption?: string;
  views: number;
  likes: number;
  comments: number;
  reposts: number;
  shares: number;
  bookmarks: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  isBoosted?: boolean;
}/*  */

export interface OverviewMetrics {
  views: number;
  accountsReached: number;
  averageWatchTime: string;
  follows: number;
  skipRate: number;
}

export interface AudienceViewers {
  followers: number;
  nonFollowers: number;
}

export interface BreakdownItem {
  label: string;
  percentage: number;
  color?: 'magenta' | 'purple' | 'blue' | 'gray';
}

export interface AudienceDetails {
  countries: BreakdownItem[];
  ageRanges: BreakdownItem[];
  genders: BreakdownItem[];
}

export interface ActionSheetItem {
  id: string;
  label: string;
  icon: string;
  isPrimary?: boolean;
  isDestructive?: boolean;
  badge?: string;
}

export interface ReelComment {
  username: string;
  avatar: string;
  text: string;
  likes?: number;
  createdAt?: string;
}
