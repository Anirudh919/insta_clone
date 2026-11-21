import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ig-android-nav',
  imports: [CommonModule],
  templateUrl: './ig-android-nav.component.html',
  styleUrl: './ig-android-nav.component.css'
})
export class IgAndroidNavComponent {
  readonly isDark = input<boolean>(false);
  readonly onBack = output<void>();
  readonly onHome = output<void>();
  readonly onRecent = output<void>();
}
