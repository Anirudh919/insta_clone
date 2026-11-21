import { Routes } from '@angular/router';
import { PostPageComponent } from './pages/post-page/post-page.component';
import { InsightsPageComponent } from './pages/insights-page/insights-page.component';
import { ShowcasePageComponent } from './pages/showcase-page/showcase-page.component';

export const routes: Routes = [
  // First page shows the Reel Post screen (Image 5) as requested
  { path: '', component: PostPageComponent, pathMatch: 'full' },
  { path: 'post', redirectTo: '', pathMatch: 'full' },
  { path: 'insights', component: InsightsPageComponent },
  { path: 'gallery', component: ShowcasePageComponent },
  { path: '**', redirectTo: '' }
];
