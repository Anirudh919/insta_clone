import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PillOption {
  id: string;
  label: string;
}

@Component({
  selector: 'ig-pill-selector',
  imports: [CommonModule],
  templateUrl: './ig-pill-selector.component.html',
  styleUrl: './ig-pill-selector.component.css'
})
export class IgPillSelectorComponent {
  readonly options = input.required<PillOption[]>();
  readonly selectedId = input.required<string>();
  readonly onSelect = output<string>();
}
