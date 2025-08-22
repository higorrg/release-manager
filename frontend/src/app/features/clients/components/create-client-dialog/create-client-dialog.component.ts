import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ClientService } from '@shared/services/client.service';
import { CreateClientRequest } from '@shared/models/client.model';

@Component({
  selector: 'app-create-client-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>Novo Cliente</h2>
    
    <mat-dialog-content>
      <div class="form-container">
        <mat-form-field class="full-width">
          <mat-label>Código do Cliente</mat-label>
          <input 
            matInput 
            [(ngModel)]="formData.code"
            placeholder="Ex: CLI001"
            required>
          <mat-hint>Código único que identifica o cliente</mat-hint>
        </mat-form-field>
        
        <mat-form-field class="full-width">
          <mat-label>Nome do Cliente</mat-label>
          <input 
            matInput 
            [(ngModel)]="formData.name"
            placeholder="Ex: Empresa XYZ Ltda"
            required>
        </mat-form-field>
      </div>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button 
        mat-button 
        [mat-dialog-close]="false"
        [disabled]="saving()">
        Cancelar
      </button>
      
      <button 
        mat-raised-button 
        color="primary"
        (click)="save()"
        [disabled]="!isFormValid() || saving()">
        @if (saving()) {
          <mat-spinner diameter="20"></mat-spinner>
        }
        {{ saving() ? 'Criando...' : 'Criar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 300px;
    }

    .full-width {
      width: 100%;
    }

    mat-dialog-actions button {
      margin-left: 8px;
    }

    mat-spinner {
      margin-right: 8px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateClientDialogComponent {
  private clientService = inject(ClientService);
  private dialogRef = inject(MatDialogRef<CreateClientDialogComponent>);

  saving = signal(false);
  
  formData: CreateClientRequest = {
    code: '',
    name: ''
  };

  isFormValid(): boolean {
    return this.formData.code.trim().length > 0 && 
           this.formData.name.trim().length > 0;
  }

  save() {
    if (!this.isFormValid() || this.saving()) {
      return;
    }

    this.saving.set(true);
    
    const request: CreateClientRequest = {
      code: this.formData.code.trim().toUpperCase(),
      name: this.formData.name.trim()
    };

    this.clientService.createClient(request).subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogRef.close(true);
      },
      error: () => {
        this.saving.set(false);
      }
    });
  }
}