import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ig-icon',
  imports: [CommonModule],
  templateUrl: './ig-icon.component.html',
  styleUrl: './ig-icon.component.css'
})
export class IgIconComponent {
  readonly name = input.required<string>();
  readonly size = input<number>(24);
  readonly strokeWidth = input<number>(1.85);
  readonly className = input<string>('');
  readonly filled = input<boolean>(false);
}
