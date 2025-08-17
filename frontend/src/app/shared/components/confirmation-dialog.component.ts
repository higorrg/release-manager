import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  template: `
    @if (show()) {
      <div class="modal-overlay" (click)="cancel()">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
          <div class="modal-header" [class]="'modal-header-' + (config().type || 'info')">
            <h3 class="modal-title">{{ config().title }}</h3>
          </div>
          
          <div class="modal-body">
            <div class="modal-icon" [class]="'modal-icon-' + (config().type || 'info')">
              @switch (config().type) {
                @case ('danger') {
                  ⚠️
                }
                @case ('warning') {
                  ⚡
                }
                @default {
                  ℹ️
                }
              }
            </div>
            <p class="modal-message">{{ config().message }}</p>
          </div>
          
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              (click)="cancel()">
              {{ config().cancelText || 'Cancelar' }}
            </button>
            <button 
              type="button" 
              class="btn" 
              [class]="'btn-' + (config().type || 'info')"
              (click)="confirm()">
              {{ config().confirmText || 'Confirmar' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      animation: fadeIn 0.2s ease-out;
    }

    .modal-dialog {
      background: white;
      border-radius: 8px;
      max-width: 500px;
      width: 90%;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      animation: slideIn 0.2s ease-out;
    }

    .modal-header {
      padding: 20px 24px 0;
      border-radius: 8px 8px 0 0;
    }

    .modal-header-danger {
      border-top: 4px solid #dc3545;
    }

    .modal-header-warning {
      border-top: 4px solid #ffc107;
    }

    .modal-header-info {
      border-top: 4px solid #17a2b8;
    }

    .modal-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }

    .modal-body {
      padding: 20px 24px;
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }

    .modal-icon {
      font-size: 24px;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .modal-icon-danger {
      filter: hue-rotate(0deg);
    }

    .modal-icon-warning {
      filter: hue-rotate(30deg);
    }

    .modal-icon-info {
      filter: hue-rotate(180deg);
    }

    .modal-message {
      margin: 0;
      line-height: 1.5;
      color: #666;
      white-space: pre-line;
    }

    .modal-footer {
      padding: 0 24px 24px;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
      min-width: 80px;
    }

    .btn:hover {
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #5a6268;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background: #c82333;
    }

    .btn-warning {
      background: #ffc107;
      color: #212529;
    }

    .btn-warning:hover {
      background: #e0a800;
    }

    .btn-info {
      background: #17a2b8;
      color: white;
    }

    .btn-info:hover {
      background: #138496;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      from { 
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
      }
      to { 
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  `]
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
}