import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DeviceFrameComponent } from '../../components/device-frame/device-frame.component';
import { PostPageComponent } from '../post-page/post-page.component';
import { InsightsPageComponent } from '../insights-page/insights-page.component';
import { IgActionSheetComponent } from '../../components/ig-action-sheet/ig-action-sheet.component';
import { IgIconComponent } from '../../components/ig-icon/ig-icon.component';
import { InsightsService } from '../../services/insights.service';

type ViewMode = 'all' | 'screen1_country' | 'screen2_age' | 'screen3_overview' | 'screen4_menu' | 'screen5_post';

@Component({
  selector: 'app-showcase-page',
  imports: [
    CommonModule,
    DeviceFrameComponent,
    PostPageComponent,
    InsightsPageComponent,
    IgActionSheetComponent,
    IgIconComponent
  ],
  templateUrl: './showcase-page.component.html',
  styleUrl: './showcase-page.component.css'
})
export class ShowcasePageComponent {
  readonly service = inject(InsightsService);
  private readonly router = inject(Router);

  readonly viewMode = signal<ViewMode>('all');
  readonly showDeviceFrame = signal<boolean>(true);
  readonly showCustomizer = signal<boolean>(false);
  readonly globalToast = signal<string | null>(null);

  setView(mode: ViewMode) {
    this.viewMode.set(mode);
    if (mode === 'screen1_country') {
      this.service.setTab('Audience');
      this.service.setAudienceFilter('Country');
      this.service.closeActionSheet();
    } else if (mode === 'screen2_age') {
      this.service.setTab('Audience');
      this.service.setAudienceFilter('Age');
      this.service.closeActionSheet();
    } else if (mode === 'screen3_overview') {
      this.service.setTab('Overview');
      this.service.closeActionSheet();
    } else if (mode === 'screen4_menu') {
      this.service.openActionSheet();
    } else if (mode === 'screen5_post') {
      this.service.closeActionSheet();
    }
  }

  toggleDeviceFrame() {
    this.showDeviceFrame.update(f => !f);
  }

  toggleCustomizer() {
    this.showCustomizer.update(c => !c);
  }

  updateViews(e: Event) {
    const val = Number((e.target as HTMLInputElement).value);
    this.service.overviewMetrics.update(m => ({ ...m, views: val }));
    this.service.feedReels.update(list =>
      list.map(r => (r.id === this.service.selectedReelId() ? { ...r, views: val } : r))
    );
  }

  updateLikes(e: Event) {
    const val = Number((e.target as HTMLInputElement).value);
    this.service.feedReels.update(list =>
      list.map(r => (r.id === this.service.selectedReelId() ? { ...r, likes: val } : r))
    );
  }

  updateAccountsReached(e: Event) {
    const val = Number((e.target as HTMLInputElement).value);
    this.service.overviewMetrics.update(m => ({ ...m, accountsReached: val }));
  }

  updateWatchTime(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    this.service.overviewMetrics.update(m => ({ ...m, averageWatchTime: val }));
  }

  updateFollowersPct(e: Event) {
    const val = Number((e.target as HTMLInputElement).value);
    this.service.audienceViewers.update(v => ({ ...v, followers: val, nonFollowers: Math.max(0, 100 - val) }));
  }

  updateNonFollowersPct(e: Event) {
    const val = Number((e.target as HTMLInputElement).value);
    this.service.audienceViewers.update(v => ({ ...v, nonFollowers: val, followers: Math.max(0, 100 - val) }));
  }

  handleToast(msg: string) {
    this.globalToast.set(msg);
    setTimeout(() => {
      this.globalToast.set(null);
    }, 2500);
  }
}
