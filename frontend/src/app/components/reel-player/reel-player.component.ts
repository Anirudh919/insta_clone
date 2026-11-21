import { Component, input, output, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IgIconComponent } from '../ig-icon/ig-icon.component';
import { ReelStats } from '../../models/insights.model';

@Component({
  selector: 'reel-player',
  imports: [CommonModule, IgIconComponent],
  templateUrl: './reel-player.component.html',
  styleUrl: './reel-player.component.css'
})
export class ReelPlayerComponent implements OnDestroy {
  readonly stats = input.required<ReelStats>();
  readonly isMuted = input<boolean>(true);
  readonly isPlaying = input<boolean>(true);

  readonly onMenuClick = output<void>();
  readonly onViewInsights = output<void>();
  readonly onBoostClick = output<void>();
  readonly onToggleMute = output<void>();
  readonly onTogglePlay = output<void>();
  readonly onLike = output<void>();
  readonly onBookmark = output<void>();
  readonly onCommentClick = output<void>();
  readonly onRepostClick = output<void>();
  readonly onShareClick = output<void>();
  readonly onWatchAgain = output<string>();

  readonly showHeartBurst = signal<boolean>(false);
  
  // Replay & playback progress state
  readonly isEnded = signal<boolean>(true);
  readonly isPlayingLocal = signal<boolean>(false);
  readonly playbackProgress = signal<number>(0);
  
  private playbackTimer: any = null;
  private lastTap = 0;

  ngOnDestroy() {
    this.clearTimer();
  }

  playFromStart() {
    this.clearTimer();
    this.playbackProgress.set(0);
    this.isEnded.set(false);
    this.isPlayingLocal.set(true);
    this.onWatchAgain.emit(this.stats().id);

    // Simulate 5-second video playback duration matching Average Watch Time
    const DURATION_MS = 5000;
    const INTERVAL_MS = 50;
    const stepPct = (INTERVAL_MS / DURATION_MS) * 100;

    this.playbackTimer = setInterval(() => {
      const current = this.playbackProgress();
      if (current >= 100) {
        this.stopPlayback(true);
      } else {
        this.playbackProgress.set(Math.min(100, current + stepPct));
      }
    }, INTERVAL_MS);
  }

  stopPlayback(ended: boolean = true) {
    this.clearTimer();
    this.isPlayingLocal.set(false);
    this.isEnded.set(ended);
    if (ended) {
      this.playbackProgress.set(100);
    }
  }

  handleWatchAgain(e: MouseEvent) {
    e.stopPropagation();
    this.playFromStart();
  }

  handleTap() {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - this.lastTap < DOUBLE_TAP_DELAY) {
      // Double tap detected: Like!
      this.triggerHeartBurst();
      this.onLike.emit();
    } else {
      // Single tap: toggle play/pause or replay
      if (this.isPlayingLocal()) {
        this.stopPlayback(false);
      } else if (this.isEnded()) {
        this.playFromStart();
      } else {
        // Resume
        this.resumePlayback();
      }
      this.onTogglePlay.emit();
    }
    this.lastTap = now;
  }

  resumePlayback() {
    this.clearTimer();
    this.isPlayingLocal.set(true);
    this.isEnded.set(false);

    const DURATION_MS = 5000;
    const INTERVAL_MS = 50;
    const stepPct = (INTERVAL_MS / DURATION_MS) * 100;

    this.playbackTimer = setInterval(() => {
      const current = this.playbackProgress();
      if (current >= 100) {
        this.stopPlayback(true);
      } else {
        this.playbackProgress.set(Math.min(100, current + stepPct));
      }
    }, INTERVAL_MS);
  }

  private clearTimer() {
    if (this.playbackTimer) {
      clearInterval(this.playbackTimer);
      this.playbackTimer = null;
    }
  }

  triggerHeartBurst() {
    this.showHeartBurst.set(true);
    setTimeout(() => {
      this.showHeartBurst.set(false);
    }, 700);
  }

  handleMuteToggle(e: MouseEvent) {
    e.stopPropagation();
    this.onToggleMute.emit();
  }
}
