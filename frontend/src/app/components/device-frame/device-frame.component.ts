import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'device-frame',
  imports: [CommonModule],
  templateUrl: './device-frame.component.html',
  styleUrl: './device-frame.component.css'
})
export class DeviceFrameComponent {
  readonly enableShadow = input<boolean>(true);
}
