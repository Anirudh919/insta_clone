import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IgStatusBarComponent } from '../../components/ig-status-bar/ig-status-bar.component';
import { IgHeaderComponent } from '../../components/ig-header/ig-header.component';
import { IgIconComponent } from '../../components/ig-icon/ig-icon.component';
import { IgTabsComponent } from '../../components/ig-tabs/ig-tabs.component';
import { IgMetricCardComponent } from '../../components/ig-metric-card/ig-metric-card.component';
import { IgProgressBarComponent } from '../../components/ig-progress-bar/ig-progress-bar.component';
import { IgPillSelectorComponent, PillOption } from '../../components/ig-pill-selector/ig-pill-selector.component';
import { IgActionSheetComponent } from '../../components/ig-action-sheet/ig-action-sheet.component';
import { InsightsService } from '../../services/insights.service';

export interface MetricEditState {
  views: number;
  likes: number;
  comments: number;
  reposts: number;
  shares: number;
  bookmarks: number;
  accountsReached: number;
  averageWatchTime: string;
  follows: number;
  skipRate: number;
  followers: number;
  nonFollowers: number;
  age13_17: number;
  age18_24: number;
  age25_34: number;
  countryIndia: number;
  countryUS: number;
  countryBrazil: number;
  genderMen: number;
  genderWomen: number;
}

@Component({
  selector: 'app-insights-page',
  imports: [
    CommonModule,
    FormsModule,
    IgStatusBarComponent,
    IgHeaderComponent,
    IgIconComponent,
    IgTabsComponent,
    IgMetricCardComponent,
    IgProgressBarComponent,
    IgPillSelectorComponent,
    IgActionSheetComponent
  ],
  templateUrl: './insights-page.component.html',
  styleUrl: './insights-page.component.css'
})
export class InsightsPageComponent implements OnInit {
  readonly service = inject(InsightsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly audiencePillOptions: PillOption[] = [
    { id: 'Age', label: 'Age' },
    { id: 'Country', label: 'Country' },
    { id: 'Gender', label: 'Gender' }
  ];

  readonly activeModal = signal<{ title: string; description: string } | null>(null);
  readonly toastMessage = signal<string | null>(null);
  readonly newCommentInput = signal<string>('');
  readonly activeEditorTab = signal<'metrics' | 'audience' | 'presets'>('metrics');

  // Country dynamic add/delete state
  readonly showAddCountryForm = signal<boolean>(false);
  readonly newCountryName = signal<string>('');
  readonly newCountryPct = signal<number>(10);
  readonly editCountriesList = signal<{ label: string; percentage: number; color?: 'magenta' | 'purple' | 'blue' | 'gray' }[]>([]);

  // Live Editor Form State
  readonly editForm = signal<MetricEditState>({
    views: 8100,
    likes: 920,
    comments: 63,
    reposts: 54,
    shares: 230,
    bookmarks: 310,
    accountsReached: 7200,
    averageWatchTime: '16s',
    follows: 115,
    skipRate: 15.3,
    followers: 22,
    nonFollowers: 78,
    age13_17: 22,
    age18_24: 60,
    age25_34: 18,
    countryIndia: 80,
    countryUS: 12,
    countryBrazil: 8,
    genderMen: 70,
    genderWomen: 30
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const reelId = params['reelId'];
      if (reelId) {
        this.service.loadReelInsights(reelId);
      }
    });
  }

  handleBack() {
    this.router.navigate(['/']);
  }

  navigateToPost() {
    this.router.navigate(['/']);
  }

  handleSelectReel(reelId: string) {
    this.service.loadReelInsights(reelId);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { reelId },
      queryParamsHandling: 'merge'
    });
    this.showToast(`📊 Loaded live insights for ${reelId}`);
  }

  handlePillSelect(pillId: string) {
    this.service.setAudienceFilter(pillId as 'Age' | 'Country' | 'Gender');
  }

  showInfoModal(title: string, description: string) {
    this.activeModal.set({ title, description });
  }

  handleRepost() {
    this.service.repostReel().subscribe({
      next: (res) => {
        this.showToast(`🔁 Reposted! Total: ${res?.data?.reposts ?? 'updated'}`);
      },
      error: () => {
        this.showToast('🔁 Reposted reel to your profile');
      }
    });
  }

  handleShare() {
    this.service.shareReel().subscribe({
      next: (res) => {
        navigator.clipboard?.writeText(window.location.href);
        this.showToast(`↗️ Share link copied! Total: ${res?.data?.shares ?? 'updated'}`);
      },
      error: () => {
        this.showToast('↗️ Share link copied');
      }
    });
  }

  handleCommentClick() {
    this.service.openCommentsSheet();
  }

  handleSendComment() {
    const text = this.newCommentInput().trim();
    if (!text) return;
    this.service.postComment(text).subscribe({
      next: () => {
        this.newCommentInput.set('');
        this.showToast('💬 Comment posted & saved to MongoDB Atlas!');
      },
      error: () => {
        this.showToast('⚠️ Could not post comment');
      }
    });
  }

  openMetricsEditor() {
    const reel = this.service.reelStats();
    const overview = this.service.overviewMetrics();
    const viewers = this.service.audienceViewers();
    const details = this.service.audienceDetails();

    const cIndia = details.countries.find(c => c.label === 'India')?.percentage ?? 80;
    const cUS = details.countries.find(c => c.label.includes('United States') || c.label.includes('USA'))?.percentage ?? 12;
    const cBrazil = details.countries.find(c => c.label === 'Brazil')?.percentage ?? 8;

    const a13 = details.ageRanges.find(a => a.label === '13-17')?.percentage ?? 22;
    const a18 = details.ageRanges.find(a => a.label === '18-24')?.percentage ?? 60;
    const a25 = details.ageRanges.find(a => a.label === '25-34')?.percentage ?? 18;

    const gMen = details.genders.find(g => g.label === 'Men')?.percentage ?? 70;
    const gWomen = details.genders.find(g => g.label === 'Women')?.percentage ?? 30;

    this.editCountriesList.set(
      details.countries && details.countries.length > 0
        ? details.countries.map(c => ({ label: c.label, percentage: c.percentage, color: c.color || 'magenta' }))
        : [
            { label: 'India', percentage: 80, color: 'magenta' },
            { label: 'United States', percentage: 12, color: 'magenta' },
            { label: 'Brazil', percentage: 8, color: 'magenta' }
          ]
    );

    this.editForm.set({
      views: reel.views,
      likes: reel.likes,
      comments: reel.comments,
      reposts: reel.reposts,
      shares: reel.shares,
      bookmarks: reel.bookmarks,
      accountsReached: overview.accountsReached,
      averageWatchTime: overview.averageWatchTime,
      follows: overview.follows,
      skipRate: overview.skipRate,
      followers: viewers.followers,
      nonFollowers: viewers.nonFollowers,
      age13_17: a13,
      age18_24: a18,
      age25_34: a25,
      countryIndia: cIndia,
      countryUS: cUS,
      countryBrazil: cBrazil,
      genderMen: gMen,
      genderWomen: gWomen
    });

    this.service.openMetricsEditor();
  }

  addCountryToForm() {
    this.editCountriesList.update(list => [
      ...list,
      { label: 'Germany', percentage: 10, color: 'magenta' }
    ]);
  }

  removeCountryFromForm(index: number) {
    this.editCountriesList.update(list => list.filter((_, i) => i !== index));
  }

  handleAddCountrySubmit() {
    const name = this.newCountryName().trim();
    const pct = Number(this.newCountryPct()) || 10;
    if (!name) return;

    this.service.addCountry(this.service.selectedReelId(), {
      label: name,
      percentage: pct,
      color: 'magenta'
    }).subscribe({
      next: () => {
        this.newCountryName.set('');
        this.newCountryPct.set(10);
        this.showAddCountryForm.set(false);
        this.showToast(`✓ Added country "${name}" (${pct}%) to MongoDB Atlas!`);
      },
      error: () => {
        this.showToast('⚠️ Could not add country');
      }
    });
  }

  handleDeleteCountry(countryLabel: string) {
    this.service.deleteCountry(this.service.selectedReelId(), countryLabel).subscribe({
      next: () => {
        this.showToast(`✓ Removed ${countryLabel} from MongoDB Atlas`);
      },
      error: () => {
        this.showToast('⚠️ Could not remove country');
      }
    });
  }

  applyPreset(preset: 'reference_images' | 'gym_reel') {
    if (preset === 'reference_images') {
      this.editCountriesList.set([
        { label: 'India', percentage: 80, color: 'magenta' },
        { label: 'United States', percentage: 12, color: 'magenta' },
        { label: 'Brazil', percentage: 8, color: 'magenta' }
      ]);
      this.editForm.set({
        views: 8100,
        likes: 920,
        comments: 63,
        reposts: 54,
        shares: 230,
        bookmarks: 310,
        accountsReached: 7200,
        averageWatchTime: '16s',
        follows: 115,
        skipRate: 15.3,
        followers: 22,
        nonFollowers: 78,
        age13_17: 22,
        age18_24: 60,
        age25_34: 18,
        countryIndia: 80,
        countryUS: 12,
        countryBrazil: 8,
        genderMen: 70,
        genderWomen: 30
      });
      this.showToast('Loaded Reference Images (920 likes, India 80%, Men 70%)');
    } else {
      this.editCountriesList.set([
        { label: 'India', percentage: 100, color: 'magenta' }
      ]);
      this.editForm.set({
        views: 185,
        likes: 2,
        comments: 0,
        reposts: 0,
        shares: 0,
        bookmarks: 0,
        accountsReached: 223,
        averageWatchTime: '5s',
        follows: 0,
        skipRate: 55.9,
        followers: 50.8,
        nonFollowers: 49.2,
        age13_17: 0,
        age18_24: 100,
        age25_34: 0,
        countryIndia: 100,
        countryUS: 0,
        countryBrazil: 0,
        genderMen: 84.5,
        genderWomen: 15.5
      });
      this.showToast('Loaded Duo Brothers Gym Reel Preset');
    }
  }

  saveMetrics() {
    const form = this.editForm();
    const payload = {
      overview: {
        views: Number(form.views),
        accountsReached: Number(form.accountsReached),
        averageWatchTime: form.averageWatchTime,
        follows: Number(form.follows),
        skipRate: Number(form.skipRate)
      },
      audience: {
        viewers: {
          followers: Number(form.followers),
          nonFollowers: Number(form.nonFollowers)
        },
        countries: this.editCountriesList().filter(c => c.label && c.label.trim()).map(c => ({
          label: c.label.trim(),
          percentage: Number(c.percentage) || 0,
          color: 'magenta'
        })),
        ageRanges: [
          { label: '13-17', percentage: Number(form.age13_17), color: 'magenta' },
          { label: '18-24', percentage: Number(form.age18_24), color: 'magenta' },
          { label: '25-34', percentage: Number(form.age25_34), color: 'magenta' }
        ],
        genders: [
          { label: 'Men', percentage: Number(form.genderMen), color: 'magenta' },
          { label: 'Women', percentage: Number(form.genderWomen), color: 'purple' }
        ]
      },
      reelStats: {
        views: Number(form.views),
        likes: Number(form.likes),
        comments: Number(form.comments),
        reposts: Number(form.reposts),
        shares: Number(form.shares),
        bookmarks: Number(form.bookmarks)
      }
    };

    this.service.updateLiveMetrics(this.service.selectedReelId(), payload).subscribe({
      next: () => {
        this.service.closeMetricsEditor();
        this.showToast('✓ All metrics & countries updated in MongoDB Atlas!');
      },
      error: () => {
        this.showToast('⚠️ Could not update metrics');
      }
    });
  }

  resetMetrics() {
    this.service.resetLiveMetrics(this.service.selectedReelId()).subscribe({
      next: () => {
        this.service.closeMetricsEditor();
        this.showToast('↻ Metrics restored to default seed');
      },
      error: () => {
        this.showToast('⚠️ Reset failed');
      }
    });
  }

  handleActionSheetItem(actionId: string) {
    this.service.closeActionSheet();
    if (actionId === 'edit') {
      this.openMetricsEditor();
    } else if (actionId === 'view-insights') {
      this.service.setTab('Overview');
      this.showToast('Reel Insights refreshed');
    } else {
      this.service.executeActionSheetItem(actionId).subscribe({
        next: (res: any) => {
          this.showToast(res?.message || `Selected: ${actionId}`);
        },
        error: () => {
          this.showToast(`Selected: ${actionId}`);
        }
      });
    }
  }

  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 2800);
  }
}
