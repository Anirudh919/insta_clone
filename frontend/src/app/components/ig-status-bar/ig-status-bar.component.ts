import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ig-status-bar',
  imports: [CommonModule],
  templateUrl: './ig-status-bar.component.html',
  styleUrl: './ig-status-bar.component.css'
})
export class IgStatusBarComponent {
  readonly isDark = input<boolean>(false);
  readonly time = input<string>('4:05');
  readonly battery = input<number>(8);
}
