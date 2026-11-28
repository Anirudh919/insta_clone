import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ReelStats, OverviewMetrics, AudienceViewers, AudienceDetails, ActionSheetItem, ReelComment } from '../models/insights.model';

@Injectable({
  providedIn: 'root'
})
export class InsightsService {
  private readonly http = inject(HttpClient);
  
  // Dynamic API URL: uses localStorage override, production backend URL, or localhost:5000
  readonly apiUrl = (typeof window !== 'undefined' && localStorage.getItem('API_URL'))
    ? localStorage.getItem('API_URL')!.replace(/\/$/, '') + '/api'
    : (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
      ? 'https://insta-clone-avyu.onrender.com' // Replace with your live Render backend URL
      : 'http://localhost:5000/api';

  // Feed of multiple reels for continuous scrolling
  readonly feedReels = signal<ReelStats[]>([
    {
      id: 'reel_001',
      username: 'duo_brothers_65',
      userAvatar: '/assets/avatar.jpg',
      audioTitle: 'Vikram Sarkar · Naam Chale',
      thumbnailUrl: '/assets/gym_reel_video.jpg',
      videoUrl: '/assets/gym_reel_video.jpg',
      caption: 'Late night workout session 💪🔥 Vikram Sarkar · Naam Chale',
      views: 170,
      likes: 2,
      comments: 0,
      reposts: 0,
      shares: 0,
      bookmarks: 0,
      isLiked: false,
      isBookmarked: false
    },
    {
      id: 'reel_002',
      username: 'duo_brothers_65',
      userAvatar: '/assets/avatar.jpg',
      audioTitle: 'duo_brothers_65 · Original audio (may include au...',
      thumbnailUrl: '/assets/reel_thumb.jpg',
      videoUrl: '/assets/reel_video.jpg',
      caption: 'Flying the winter drone in sub-zero snow ❄️ Follow @duo_brothers_65 for more!',
      views: 265,
      likes: 2,
      comments: 0,
      reposts: 0,
      shares: 0,
      bookmarks: 0,
      isLiked: false,
      isBookmarked: false
    },
    {
      id: 'reel_003',
      username: 'tech_gadget_zone',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
      audioTitle: 'tech_gadget_zone · Trending Cyber Beat',
      thumbnailUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=400&auto=format&fit=crop',
      videoUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop',
      caption: 'This pocket spinner is surprisingly fast! ⚡ Review coming tomorrow.',
      views: 1420,
      likes: 89,
      comments: 14,
      reposts: 4,
      shares: 18,
      bookmarks: 31,
      isLiked: false,
      isBookmarked: false
    },
    {
      id: 'reel_004',
      username: 'wanderlust_nomad',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop',
      audioTitle: 'Arctic Vibes · Original Chill Sound',
      thumbnailUrl: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=400&auto=format&fit=crop',
      videoUrl: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=800&auto=format&fit=crop',
      caption: 'Lost in the winter wonderland. The silence here is unmatched ✨',
      views: 3840,
      likes: 342,
      comments: 28,
      reposts: 15,
      shares: 64,
      bookmarks: 95,
      isLiked: false,
      isBookmarked: false
    },
    {
      id: 'reel_005',
      username: 'urban_lens_captures',
      userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop',
      audioTitle: 'Midnight Tokyo · Lo-Fi Beats',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop',
      videoUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop',
      caption: 'Neon nights & city reflections. Shot on 35mm f/1.4 🔥',
      views: 5920,
      likes: 614,
      comments: 45,
      reposts: 33,
      shares: 112,
      bookmarks: 180,
      isLiked: false,
      isBookmarked: false
    }
  ]);

  readonly selectedReelId = signal<string>('reel_001');

  // Currently focused reel stats for backward compatibility
  readonly reelStats = computed(() => {
    return this.feedReels().find(r => r.id === this.selectedReelId()) || this.feedReels()[0];
  });

  // Overview metrics (Image 3)
  readonly overviewMetrics = signal<OverviewMetrics>({
    views: 265,
    accountsReached: 223,
    averageWatchTime: '5s',
    follows: 0,
    skipRate: 55.9
  });

  // Audience viewers (Images 1 & 2)
  readonly audienceViewers = signal<AudienceViewers>({
    followers: 50.8,
    nonFollowers: 49.2
  });

  // Audience details breakdown
  readonly audienceDetails = signal<AudienceDetails>({
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
  });

  // Action sheet menu items (20 items matching Instagram specs)
  readonly actionMenuItems = signal<ActionSheetItem[]>([
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
  ]);

  // UI state
  readonly activeTab = signal<'Overview' | 'Engagement' | 'Audience'>('Audience');
  readonly activeAudienceFilter = signal<'Age' | 'Country' | 'Gender'>('Country');
  readonly isActionSheetOpen = signal<boolean>(false);
  readonly isQrModalOpen = signal<boolean>(false);
  readonly isMetricsEditorOpen = signal<boolean>(false);
  readonly isCommentsSheetOpen = signal<boolean>(false);
  readonly isCreatePostOpen = signal<boolean>(false);
  readonly comments = signal<ReelComment[]>([]);
  readonly isMuted = signal<boolean>(true);
  readonly isPlaying = signal<boolean>(true);
  readonly isBackendConnected = signal<boolean>(false);

  constructor() {
    this.loadFeedFromBackend();
  }

  // Fetch all reels from Node.js backend
  loadFeedFromBackend() {
    this.http.get<any>(`${this.apiUrl}/reels`).subscribe({
      next: (res) => {
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: ReelStats[] = res.data.map((d: any) => ({
            id: d.reelId || d._id,
            username: d.username,
            userAvatar: d.userAvatar,
            audioTitle: d.audioTitle,
            thumbnailUrl: d.thumbnailUrl,
            videoUrl: d.videoUrl,
            caption: d.caption,
            views: d.views ?? 0,
            likes: d.likes ?? 0,
            comments: d.comments ?? 0,
            reposts: d.reposts ?? 0,
            shares: d.shares ?? 0,
            bookmarks: d.bookmarks ?? 0,
            isLiked: d.isLiked ?? false,
            isBookmarked: d.isBookmarked ?? false,
            isBoosted: d.isBoosted ?? false
          }));

          this.feedReels.set(mapped);
          this.isBackendConnected.set(true);
        }
      },
      error: () => {
        this.isBackendConnected.set(false);
      }
    });

    this.loadReelInsights(this.selectedReelId());
  }

  loadReelInsights(reelId: string) {
    this.selectedReelId.set(reelId);

    this.http.get<any>(`${this.apiUrl}/insights/${reelId}`).subscribe({
      next: (res) => {
        if (res?.success && res.data) {
          const ins = res.data;
          if (ins.overview) {
            this.overviewMetrics.set(ins.overview);
          }
          if (ins.audience) {
            if (ins.audience.viewers) {
              this.audienceViewers.set(ins.audience.viewers);
            }
            this.audienceDetails.set({
              countries: ins.audience.countries || this.audienceDetails().countries,
              ageRanges: ins.audience.ageRanges || this.audienceDetails().ageRanges,
              genders: ins.audience.genders || this.audienceDetails().genders
            });
          }
          if (ins.reelStats) {
            this.feedReels.update(list =>
              list.map(r => r.id === reelId ? {
                ...r,
                likes: ins.reelStats.likes ?? r.likes,
                comments: ins.reelStats.comments ?? r.comments,
                reposts: ins.reelStats.reposts ?? r.reposts,
                shares: ins.reelStats.shares ?? r.shares,
                bookmarks: ins.reelStats.bookmarks ?? r.bookmarks,
                views: ins.reelStats.views ?? r.views
              } : r)
            );
          }
        }
      },
      error: () => {}
    });

    this.loadComments(reelId);
  }

  loadComments(reelId?: string) {
    const id = reelId || this.selectedReelId();
    this.http.get<any>(`${this.apiUrl}/reels/${id}/comments`).subscribe({
      next: (res) => {
        if (res?.success && Array.isArray(res.data)) {
          this.comments.set(res.data);
        }
      },
      error: () => {
        this.comments.set([]);
      }
    });
  }

  postComment(text: string, reelId?: string) {
    const id = reelId || this.selectedReelId();
    return this.http.post<any>(`${this.apiUrl}/reels/${id}/comment`, { text }).pipe(
      tap((res) => {
        if (res?.success && res.data) {
          this.comments.update(c => [res.data.comment, ...c]);
          const newCount = res.data.commentsCount;
          this.feedReels.update(list =>
            list.map(r => r.id === id ? { ...r, comments: newCount } : r)
          );
        }
      })
    );
  }

  repostReel(reelId?: string) {
    const id = reelId || this.selectedReelId();
    return this.http.post<any>(`${this.apiUrl}/reels/${id}/repost`, {}).pipe(
      tap((res) => {
        if (res?.success && res.data) {
          const count = res.data.reposts;
          this.feedReels.update(list =>
            list.map(r => r.id === id ? { ...r, reposts: count } : r)
          );
        }
      })
    );
  }

  shareReel(reelId?: string) {
    const id = reelId || this.selectedReelId();
    return this.http.post<any>(`${this.apiUrl}/reels/${id}/share`, {}).pipe(
      tap((res) => {
        if (res?.success && res.data) {
          const count = res.data.shares;
          this.feedReels.update(list =>
            list.map(r => r.id === id ? { ...r, shares: count } : r)
          );
        }
      })
    );
  }

  updateLiveMetrics(reelId: string, payload: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/insights/${reelId}`, payload).pipe(
      tap((res) => {
        if (res?.success && res.data) {
          const ins = res.data;
          if (ins.overview) this.overviewMetrics.set(ins.overview);
          if (ins.audience) {
            if (ins.audience.viewers) this.audienceViewers.set(ins.audience.viewers);
            this.audienceDetails.set({
              countries: ins.audience.countries || this.audienceDetails().countries,
              ageRanges: ins.audience.ageRanges || this.audienceDetails().ageRanges,
              genders: ins.audience.genders || this.audienceDetails().genders
            });
          }
          if (ins.reelStats) {
            this.feedReels.update(list =>
              list.map(r => r.id === reelId ? {
                ...r,
                likes: ins.reelStats.likes ?? r.likes,
                comments: ins.reelStats.comments ?? r.comments,
                reposts: ins.reelStats.reposts ?? r.reposts,
                shares: ins.reelStats.shares ?? r.shares,
                bookmarks: ins.reelStats.bookmarks ?? r.bookmarks,
                views: ins.reelStats.views ?? r.views
              } : r)
            );
          }
        }
      })
    );
  }

  updateReelDetails(reelId: string, payload: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/reels/${reelId}`, payload).pipe(
      tap((res) => {
        if (res?.success && res.data) {
          const updated = res.data;
          this.feedReels.update(list =>
            list.map(r => r.id === reelId ? {
              ...r,
              username: updated.username ?? r.username,
              audioTitle: updated.audioTitle ?? r.audioTitle,
              caption: updated.caption ?? r.caption,
              likes: updated.likes ?? r.likes,
              comments: updated.comments ?? r.comments,
              reposts: updated.reposts ?? r.reposts,
              shares: updated.shares ?? r.shares,
              bookmarks: updated.bookmarks ?? r.bookmarks,
              views: updated.views ?? r.views
            } : r)
          );
        }
      })
    );
  }

  resetLiveMetrics(reelId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/insights/${reelId}/reset`, {}).pipe(
      tap(() => {
        this.loadReelInsights(reelId);
      })
    );
  }

  openMetricsEditor() {
    this.isMetricsEditorOpen.set(true);
  }

  closeMetricsEditor() {
    this.isMetricsEditorOpen.set(false);
  }

  openCommentsSheet(reelId?: string) {
    if (reelId) {
      this.selectedReelId.set(reelId);
      this.loadComments(reelId);
    }
    this.isCommentsSheetOpen.set(true);
  }

  closeCommentsSheet() {
    this.isCommentsSheetOpen.set(false);
  }

  openCreatePostModal() {
    this.isCreatePostOpen.set(true);
  }

  closeCreatePostModal() {
    this.isCreatePostOpen.set(false);
  }

  createReel(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reels`, payload).pipe(
      tap((res) => {
        if (res?.success && res.data) {
          const d = res.data;
          const newReel: ReelStats = {
            id: d.reelId || d._id,
            username: d.username,
            userAvatar: d.userAvatar,
            audioTitle: d.audioTitle,
            thumbnailUrl: d.thumbnailUrl,
            videoUrl: d.videoUrl,
            caption: d.caption,
            views: d.views ?? 0,
            likes: d.likes ?? 0,
            comments: 0,
            reposts: 0,
            shares: 0,
            bookmarks: 0,
            isLiked: false,
            isBookmarked: false,
            isBoosted: false
          };
          this.feedReels.update(list => [newReel, ...list]);
          this.selectedReelId.set(newReel.id);
        }
      })
    );
  }

  addCountry(reelId: string, country: { label: string; percentage: number; color?: string }): Observable<any> {
    const id = reelId || this.selectedReelId();
    return this.http.post<any>(`${this.apiUrl}/insights/${id}/countries`, country).pipe(
      tap((res) => {
        if (res?.success && Array.isArray(res.data)) {
          this.audienceDetails.update(d => ({
            ...d,
            countries: res.data
          }));
        }
      })
    );
  }

  deleteCountry(reelId: string, countryLabel: string): Observable<any> {
    const id = reelId || this.selectedReelId();
    return this.http.delete<any>(`${this.apiUrl}/insights/${id}/countries/${encodeURIComponent(countryLabel)}`).pipe(
      tap((res) => {
        if (res?.success && Array.isArray(res.data)) {
          this.audienceDetails.update(d => ({
            ...d,
            countries: res.data
          }));
        }
      })
    );
  }

  setTab(tab: 'Overview' | 'Engagement' | 'Audience') {
    this.activeTab.set(tab);
  }

  setAudienceFilter(filter: 'Age' | 'Country' | 'Gender') {
    this.activeAudienceFilter.set(filter);
  }

  openActionSheet(reelId?: string) {
    if (reelId) {
      this.selectedReelId.set(reelId);
    }
    this.isActionSheetOpen.set(true);
  }

  closeActionSheet() {
    this.isActionSheetOpen.set(false);
  }

  openQrModal(reelId?: string) {
    if (reelId) {
      this.selectedReelId.set(reelId);
    }
    this.isQrModalOpen.set(true);
  }

  closeQrModal() {
    this.isQrModalOpen.set(false);
  }

  toggleLike(reelId?: string) {
    const id = reelId || this.selectedReelId();

    this.feedReels.update(list =>
      list.map(r => {
        if (r.id === id) {
          const isLiked = !r.isLiked;
          const likes = isLiked ? r.likes + 1 : Math.max(0, r.likes - 1);
          return { ...r, isLiked, likes };
        }
        return r;
      })
    );

    this.http.post<any>(`${this.apiUrl}/reels/${id}/like`, {}).subscribe({
      next: (res) => {
        if (res?.data) {
          this.feedReels.update(list =>
            list.map(r => (r.id === id ? { ...r, likes: res.data.likes, isLiked: res.data.isLiked } : r))
          );
        }
      },
      error: () => {}
    });
  }

  toggleBookmark(reelId?: string) {
    const id = reelId || this.selectedReelId();

    this.feedReels.update(list =>
      list.map(r => {
        if (r.id === id) {
          const isBookmarked = !r.isBookmarked;
          const bookmarks = isBookmarked ? r.bookmarks + 1 : Math.max(0, r.bookmarks - 1);
          return { ...r, isBookmarked, bookmarks };
        }
        return r;
      })
    );

    this.http.post<any>(`${this.apiUrl}/reels/${id}/bookmark`, {}).subscribe({
      next: (res) => {
        if (res?.data) {
          this.feedReels.update(list =>
            list.map(r => (r.id === id ? { ...r, bookmarks: res.data.bookmarks, isBookmarked: res.data.isBookmarked } : r))
          );
        }
      },
      error: () => {}
    });
  }

  recordView(reelId?: string) {
    const id = reelId || this.selectedReelId();
    this.http.post<any>(`${this.apiUrl}/reels/${id}/view`, {}).subscribe({
      next: (res) => {
        if (res?.data) {
          this.feedReels.update(list =>
            list.map(r => (r.id === id ? { ...r, views: res.data.views } : r))
          );
          if (res.data.accountsReached && id === this.selectedReelId()) {
            this.overviewMetrics.update(m => ({ ...m, views: res.data.views, accountsReached: res.data.accountsReached }));
          }
        }
      },
      error: () => {}
    });
  }

  boostReel(reelId?: string) {
    const id = reelId || this.selectedReelId();
    return this.http.post<any>(`${this.apiUrl}/reels/${id}/boost`, {});
  }

  executeActionSheetItem(actionId: string, reelId?: string) {
    const id = reelId || this.selectedReelId();
    return this.http.post<any>(`${this.apiUrl}/reels/${id}/actions/${actionId}`, {});
  }

  toggleMute() {
    this.isMuted.update(m => !m);
  }

  togglePlay() {
    this.isPlaying.update(p => !p);
  }
}
