import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IgIconComponent } from '../ig-icon/ig-icon.component';

@Component({
  selector: 'ig-header',
  imports: [CommonModule, IgIconComponent],
  templateUrl: './ig-header.component.html',
  styleUrl: './ig-header.component.css'
})
export class IgHeaderComponent {
  readonly title = input.required<string>();
  readonly isDark = input<boolean>(false);
  readonly transparent = input<boolean>(false);
  readonly showInsightsActions = input<boolean>(false);
  readonly showCreateAction = input<boolean>(false);

  readonly onBack = output<void>();
  readonly onTrendClick = output<void>();
  readonly onMenuClick = output<void>();
  readonly onCreateClick = output<void>();
}
