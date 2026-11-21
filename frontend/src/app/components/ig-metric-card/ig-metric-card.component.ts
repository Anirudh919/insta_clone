import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ig-metric-card',
  imports: [CommonModule],
  templateUrl: './ig-metric-card.component.html',
  styleUrl: './ig-metric-card.component.css'
})
export class IgMetricCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
}
