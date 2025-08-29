import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

export interface ConfirmationConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, NzModalModule, NzButtonModule, NzIconModule],
  template: `
    <nz-modal 
      [nzVisible]="show()"
      [nzTitle]="config().title"
      [nzContent]="modalContent"
      [nzFooter]="modalFooter"
      (nzOnCancel)="cancel()">
      
      <ng-template #modalContent>
        <div style="display: flex; align-items: flex-start; gap: 16px;">
          <span nz-icon [nzType]="getIconType()" [style.color]="getIconColor()" style="font-size: 24px; margin-top: 2px;"></span>
          <p style="margin: 0; line-height: 1.5; white-space: pre-line;">{{ config().message }}</p>
        </div>
      </ng-template>
      
      <ng-template #modalFooter>
        <button nz-button nzType="default" (click)="cancel()">
          {{ config().cancelText || 'Cancelar' }}
        </button>
        <button nz-button [nzType]="getButtonType()" [nzDanger]="config().type === 'danger'" (click)="confirm()">
          {{ config().confirmText || 'Confirmar' }}
        </button>
      </ng-template>
    </nz-modal>
  `,
  styles: []
})
export class ConfirmationDialogComponent {
  config = input.required<ConfirmationConfig>();
  show = input<boolean>(false);
  
  confirmed = output<void>();
  cancelled = output<void>();

  confirm(): void {
    this.confirmed.emit();
  }

  cancel(): void {
    this.cancelled.emit();
  }

  getIconType(): string {
    switch (this.config().type) {
      case 'danger':
        return 'exclamation-circle';
      case 'warning':
        return 'warning';
      default:
        return 'info-circle';
    }
  }

  getIconColor(): string {
    switch (this.config().type) {
      case 'danger':
        return '#f5222d';
      case 'warning':
        return '#faad14';
      default:
        return '#1890ff';
    }
  }

  getButtonType(): 'primary' | 'default' | 'dashed' | 'text' | 'link' {
    return 'primary';
  }
}