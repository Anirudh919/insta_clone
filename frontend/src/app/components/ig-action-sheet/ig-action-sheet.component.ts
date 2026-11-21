import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IgIconComponent } from '../ig-icon/ig-icon.component';
import { ActionSheetItem } from '../../models/insights.model';

@Component({
  selector: 'ig-action-sheet',
  imports: [CommonModule, IgIconComponent],
  templateUrl: './ig-action-sheet.component.html',
  styleUrl: './ig-action-sheet.component.css'
})
export class IgActionSheetComponent {
  readonly isOpen = input.required<boolean>();
  readonly items = input.required<ActionSheetItem[]>();
  readonly onClose = output<void>();
  readonly onAction = output<string>();

  readonly isSaved = signal<boolean>(false);

  handleSaveToggle() {
    this.isSaved.update(s => !s);
    this.onAction.emit(this.isSaved() ? 'Saved to collection' : 'Removed from saved');
  }

  handleActionClick(action: string) {
    this.onAction.emit(action);
  }

  handleItemClick(item: ActionSheetItem) {
    this.onAction.emit(item.id);
  }
}
