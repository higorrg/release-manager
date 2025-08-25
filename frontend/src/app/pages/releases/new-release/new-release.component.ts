import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-release',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="new-release-container">
      <div class="page-header" style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h1 style="margin: 0; color: #333; font-size: 24px;">➕ Nova Release</h1>
        <p style="margin: 5px 0 0 0; color: #666;">Crie uma nova release para o sistema</p>
      </div>

      <div class="form-container" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <form [formGroup]="releaseForm" (ngSubmit)="onSubmit()">
          <div class="form-grid" style="display: grid; gap: 20px;">
            <!-- Nome da Release -->
            <div class="form-group">
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">Nome da Release *</label>
              <input 
                type="text" 
                formControlName="name"
                placeholder="Ex: Release v1.2.3"
                style="width: 100%; padding: 12px; border: 1px solid #d9d9d9; border-radius: 6px; font-size: 14px;"
                [style.border-color]="releaseForm.get('name')?.errors && releaseForm.get('name')?.touched ? '#ff4757' : '#d9d9d9'">
              <div *ngIf="releaseForm.get('name')?.errors && releaseForm.get('name')?.touched" 
                   style="color: #ff4757; font-size: 12px; margin-top: 5px;">
                Nome da release é obrigatório
              </div>
            </div>

            <!-- Versão -->
            <div class="form-group">
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">Versão *</label>
              <input 
                type="text" 
                formControlName="version"
                placeholder="Ex: 1.2.3"
                style="width: 100%; padding: 12px; border: 1px solid #d9d9d9; border-radius: 6px; font-size: 14px;"
                [style.border-color]="releaseForm.get('version')?.errors && releaseForm.get('version')?.touched ? '#ff4757' : '#d9d9d9'">
              <div *ngIf="releaseForm.get('version')?.errors && releaseForm.get('version')?.touched" 
                   style="color: #ff4757; font-size: 12px; margin-top: 5px;">
                Versão é obrigatória
              </div>
            </div>

            <!-- Descrição -->
            <div class="form-group">
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">Descrição</label>
              <textarea 
                formControlName="description"
                placeholder="Descreva as principais mudanças desta release..."
                rows="4"
                style="width: 100%; padding: 12px; border: 1px solid #d9d9d9; border-radius: 6px; font-size: 14px; resize: vertical;">
              </textarea>
            </div>

            <!-- Prioridade -->
            <div class="form-group">
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">Prioridade</label>
              <select 
                formControlName="priority"
                style="width: 100%; padding: 12px; border: 1px solid #d9d9d9; border-radius: 6px; font-size: 14px;">
                <option value="LOW">🟢 Baixa</option>
                <option value="MEDIUM">🟡 Média</option>
                <option value="HIGH">🟠 Alta</option>
                <option value="CRITICAL">🔴 Crítica</option>
              </select>
            </div>

            <!-- Ambiente Alvo -->
            <div class="form-group">
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">Ambiente Alvo</label>
              <select 
                formControlName="targetEnvironment"
                style="width: 100%; padding: 12px; border: 1px solid #d9d9d9; border-radius: 6px; font-size: 14px;">
                <option value="DEVELOPMENT">🔧 Desenvolvimento</option>
                <option value="TESTING">🧪 Teste</option>
                <option value="STAGING">🎭 Homologação</option>
                <option value="PRODUCTION">🚀 Produção</option>
              </select>
            </div>
          </div>

          <!-- Botões -->
          <div class="form-actions" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0; display: flex; gap: 10px; justify-content: flex-end;">
            <button 
              type="button" 
              (click)="cancel()"
              style="background: #f5f5f5; color: #333; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; font-size: 14px;">
              Cancelar
            </button>
            <button 
              type="submit" 
              [disabled]="!releaseForm.valid"
              style="background: #52c41a; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; font-size: 14px;"
              [style.background]="!releaseForm.valid ? '#d9d9d9' : '#52c41a'">
              ➕ Criar Release
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class NewReleaseComponent implements OnInit {
  releaseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.releaseForm = this.fb.group({
      name: ['', Validators.required],
      version: ['', Validators.required],
      description: [''],
      priority: ['MEDIUM'],
      targetEnvironment: ['TESTING']
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.releaseForm.valid) {
      console.log('Nova release:', this.releaseForm.value);
      // Aqui você faria a chamada para o serviço de criação de release
      alert('Release criada com sucesso!');
      this.router.navigate(['/dashboard/releases']);
    }
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}