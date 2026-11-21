import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ig-progress-bar',
  imports: [CommonModule],
  templateUrl: './ig-progress-bar.component.html',
  styleUrl: './ig-progress-bar.component.css'
})
export class IgProgressBarComponent {
  readonly label = input.required<string>();
  readonly percentage = input.required<number>();
  readonly color = input<'magenta' | 'purple' | 'blue' | 'gray'>('magenta');

  readonly clampedPercentage = computed(() => {
    const val = this.percentage();
    return Math.max(0, Math.min(100, val));
  });

  readonly formattedPercentage = computed(() => {
    const val = this.percentage();
    return `${val}%`;
  });

  readonly colorClass = computed(() => {
    switch (this.color()) {
      case 'purple':
        return 'bg-purple';
      case 'blue':
        return 'bg-blue';
      case 'gray':
        return 'bg-gray';
      case 'magenta':
      default:
        return 'bg-magenta';
    }
  });
}
