import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IgStatusBarComponent } from '../../components/ig-status-bar/ig-status-bar.component';
import { IgHeaderComponent } from '../../components/ig-header/ig-header.component';
import { ReelPlayerComponent } from '../../components/reel-player/reel-player.component';
import { IgActionSheetComponent } from '../../components/ig-action-sheet/ig-action-sheet.component';
import { IgIconComponent } from '../../components/ig-icon/ig-icon.component';
import { InsightsService } from '../../services/insights.service';

@Component({
  selector: 'app-post-page',
  imports: [
    CommonModule,
    FormsModule,
    IgStatusBarComponent,
    IgHeaderComponent,
    ReelPlayerComponent,
    IgActionSheetComponent,
    IgIconComponent
  ],
  templateUrl: './post-page.component.html',
  styleUrl: './post-page.component.css'
})
export class PostPageComponent implements OnInit {
  readonly service = inject(InsightsService);
  private readonly router = inject(Router);

  readonly toastMessage = signal<string | null>(null);
  readonly newCommentInput = signal<string>('');

  // Create Post Form State
  readonly newPostForm = signal({
    username: 'duo_brothers_65',
    audioTitle: 'Vikram Sarkar · Naam Chale',
    caption: '',
    thumbnailUrl: '/assets/gym_reel_video.jpg',
    videoUrl: '/assets/gym_reel_video.jpg',
    views: 120,
    likes: 5
  });

  ngOnInit() {
    // Record view on initial reel post load to increment view counter in MongoDB
    this.service.recordView('reel_001');
  }

  handleOpenCreatePost() {
    this.service.openCreatePostModal();
  }

  selectCoverPreset(thumb: string, video?: string) {
    this.newPostForm.update(f => ({
      ...f,
      thumbnailUrl: thumb,
      videoUrl: video || thumb
    }));
  }

  handleCreatePostSubmit() {
    const form = this.newPostForm();
    if (!form.caption.trim()) {
      this.showToast('Please enter a caption for your post');
      return;
    }

    const payload = {
      username: form.username.trim() || 'duo_brothers_65',
      userAvatar: '/assets/avatar.jpg',
      audioTitle: form.audioTitle.trim() || 'Original Audio',
      caption: form.caption.trim(),
      thumbnailUrl: form.thumbnailUrl,
      videoUrl: form.videoUrl,
      views: Number(form.views) || 0,
      likes: Number(form.likes) || 0
    };

    this.service.createReel(payload).subscribe({
      next: (res) => {
        this.service.closeCreatePostModal();
        this.newPostForm.set({
          username: 'duo_brothers_65',
          audioTitle: 'Vikram Sarkar · Naam Chale',
          caption: '',
          thumbnailUrl: '/assets/gym_reel_video.jpg',
          videoUrl: '/assets/gym_reel_video.jpg',
          views: 120,
          likes: 5
        });
        this.showToast('✓ New reel published live to MongoDB Atlas!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: () => {
        this.showToast('⚠️ Failed to create reel');
      }
    });
  }

  navigateToInsights(reelId?: string) {
    const targetId = reelId || this.service.selectedReelId() || 'reel_001';
    this.service.loadReelInsights(targetId);
    this.service.closeActionSheet();
    this.router.navigate(['/insights'], { queryParams: { reelId: targetId } });
  }

  handleWatchAgain(reelId: string) {
    this.service.recordView(reelId);
    this.showToast('▶ Playing reel from start');
  }

  handleBack() {
    this.showToast('Top of Posts feed');
  }

  handleBoost(reelId?: string) {
    const id = reelId || this.service.selectedReelId();
    this.service.boostReel(id).subscribe({
      next: (res: any) => {
        this.showToast(`🚀 Ad boost active for ${id} in MongoDB!`);
      },
      error: () => {
        this.showToast(`🚀 Ad boost initiated for ${id}`);
      }
    });
  }

  handleOpenComments(reelId: string) {
    this.service.openCommentsSheet(reelId);
  }

  handleRepost(reelId: string) {
    this.service.repostReel(reelId).subscribe({
      next: (res: any) => {
        this.showToast(`🔁 Reposted reel! Total: ${res?.data?.reposts ?? 'updated'}`);
      },
      error: () => {
        this.showToast('🔁 Reposted reel to your profile');
      }
    });
  }

  handleShare(reelId: string) {
    this.service.shareReel(reelId).subscribe({
      next: (res: any) => {
        navigator.clipboard?.writeText(window.location.href);
        this.showToast(`↗️ Share link copied! Total: ${res?.data?.shares ?? 'updated'}`);
      },
      error: () => {
        this.showToast('↗️ Share link copied');
      }
    });
  }

  handleSendComment() {
    const text = this.newCommentInput().trim();
    if (!text) return;
    this.service.postComment(text).subscribe({
      next: () => {
        this.newCommentInput.set('');
        this.showToast('💬 Comment posted to MongoDB Atlas!');
      },
      error: () => {
        this.showToast('⚠️ Failed to post comment');
      }
    });
  }

  handleAction(actionId: string) {
    if (actionId === 'view-insights') {
      this.navigateToInsights(this.service.selectedReelId());
      return;
    }

    if (actionId === 'edit') {
      this.navigateToInsights(this.service.selectedReelId());
      return;
    }

    if (actionId === 'save') {
      this.service.toggleBookmark(this.service.selectedReelId());
      this.showToast('Saved to collection');
      this.service.closeActionSheet();
      return;
    }

    if (actionId === 'about') {
      this.showToast('ℹ️ About this reel: AI generated content disclosure');
      this.service.closeActionSheet();
      return;
    }

    if (actionId === 'audio') {
      this.showToast('🎵 Audio track: Naam Chale • the_vikram_sarkar');
      this.service.closeActionSheet();
      return;
    }

    if (actionId === 'qr') {
      this.service.closeActionSheet();
      this.service.openQrModal();
      return;
    }

    if (actionId === 'boost') {
      this.service.closeActionSheet();
      this.handleBoost();
      return;
    }

    // Call backend API for action
    this.service.executeActionSheetItem(actionId).subscribe({
      next: (res: any) => {
        const msg = res?.message || `Action executed: ${actionId}`;
        this.showToast(msg);
        this.service.closeActionSheet();
      },
      error: () => {
        this.showToast(`Action: ${actionId}`);
        this.service.closeActionSheet();
      }
    });
  }

  copyReelLink() {
    navigator.clipboard?.writeText(window.location.href);
    this.showToast('🔗 Reel link copied to clipboard');
    this.service.closeQrModal();
  }

  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 2800);
  }
}
