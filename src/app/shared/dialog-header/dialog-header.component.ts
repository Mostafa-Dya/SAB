import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dialog-heading-div" appDraggableDialog [ngClass]="{'text-right': rtl}">
      <span class="page-title" [ngClass]="rtl ? 'mr-4' : 'ml-4'">{{ title }}</span>
    </div>
  `,
  styleUrls: ['./dialog-header.component.scss']
})
export class DialogHeaderComponent {
  @Input() title = '';
  @Input() rtl = false;
}
