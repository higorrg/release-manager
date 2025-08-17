import { Injectable, signal } from '@angular/core';
import { ConfirmationConfig } from '../components/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private _config = signal<ConfirmationConfig | null>(null);
  private _show = signal(false);
  private _resolvePromise: ((value: boolean) => void) | null = null;

  config = this._config.asReadonly();
  show = this._show.asReadonly();

  confirm(config: ConfirmationConfig): Promise<boolean> {
    return new Promise((resolve) => {
      this._resolvePromise = resolve;
      this._config.set(config);
      this._show.set(true);
    });
  }

  onConfirmed(): void {
    this._show.set(false);
    this._resolvePromise?.(true);
    this._resolvePromise = null;
  }

  onCancelled(): void {
    this._show.set(false);
    this._resolvePromise?.(false);
    this._resolvePromise = null;
  }

  // Métodos de conveniência
  confirmDelete(itemName: string, itemType: string = 'item'): Promise<boolean> {
    return this.confirm({
      title: `Excluir ${itemType}`,
      message: `Tem certeza que deseja excluir "${itemName}"?\n\nEsta ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger'
    });
  }

  confirmAction(title: string, message: string, confirmText: string = 'Confirmar'): Promise<boolean> {
    return this.confirm({
      title,
      message,
      confirmText,
      cancelText: 'Cancelar',
      type: 'warning'
    });
  }
}