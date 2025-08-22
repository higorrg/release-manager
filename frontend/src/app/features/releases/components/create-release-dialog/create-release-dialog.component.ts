import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ReleaseService } from '@shared/services/release.service';
import { CreateReleaseRequest } from '@shared/models/release.model';

@Component({
  selector: 'app-create-release-dialog',
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
    <h2 mat-dialog-title>Nova Release</h2>
    
    <mat-dialog-content>
      <div class="form-container">
        <mat-form-field class="full-width">
          <mat-label>Nome do Produto</mat-label>
          <input 
            matInput 
            [(ngModel)]="formData.productName"
            placeholder="Ex: Sistema Principal"
            required>
        </mat-form-field>
        
        <mat-form-field class="full-width">
          <mat-label>Versão</mat-label>
          <input 
            matInput 
            [(ngModel)]="formData.version"
            placeholder="Ex: 1.0.0"
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
export class CreateReleaseDialogComponent {
  private releaseService = inject(ReleaseService);
  private dialogRef = inject(MatDialogRef<CreateReleaseDialogComponent>);

  saving = signal(false);
  
  formData: CreateReleaseRequest = {
    productName: '',
    version: ''
  };

  isFormValid(): boolean {
    return this.formData.productName.trim().length > 0 && 
           this.formData.version.trim().length > 0;
  }

  save() {
    if (!this.isFormValid() || this.saving()) {
      return;
    }

    this.saving.set(true);
    
    const request: CreateReleaseRequest = {
      productName: this.formData.productName.trim(),
      version: this.formData.version.trim()
    };

    this.releaseService.createRelease(request).subscribe({
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