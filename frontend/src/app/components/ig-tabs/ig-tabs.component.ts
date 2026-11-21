import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ig-tabs',
  imports: [CommonModule],
  templateUrl: './ig-tabs.component.html',
  styleUrl: './ig-tabs.component.css'
})
export class IgTabsComponent {
  readonly tabs = input<string[]>(['Overview', 'Engagement', 'Audience']);
  readonly activeTab = input.required<string>();
  readonly tabChange = output<any>();
}
