import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AngularmaterialModule } from '../../angularmaterial/angularmaterial.module';

@Component({
  selector: 'app-info-message',
  imports: [AngularmaterialModule],
  templateUrl: './info-message.component.html',
  styleUrl: './info-message.component.scss'
})
export class InfoMessageComponent {
  @Input  () type: 'error' | 'success' | 'info' = 'info';
  @Input() title: string = '';
  @Input() text: string = '';
  @Input() dismissible: boolean = false;
  @Output() dismissed = new EventEmitter<void>();

  get icon(): string {
    switch (this.type) {
      case 'error': return 'error';
      case 'success': return 'check_circle';
      case 'info': return 'info';
      default: return 'info';
    }
  }

  close() {
    this.dismissed.emit();
  }
}
