import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-release-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  template: `<div class="release-detail-container" style="padding: 20px;">
    <!-- Header -->
    <div class="header" style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2 style="margin: 0 0 5px 0; color: #333;">{{ release.name || 'Release ' + releaseId }}</h2>
          <p style="margin: 0; color: #666; font-size: 14px;">Versão {{ release.version || '1.0.0' }} • Produto: {{ release.product || 'Sistema Principal' }}</p>
        </div>
        <span class="status-badge" 
              [style.background-color]="getStatusColor(release.status)"
              style="padding: 8px 16px; border-radius: 16px; color: white; font-size: 14px; font-weight: 500;">
          {{ getStatusText(release.status) }}
        </span>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="tabs" style="background: white; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="display: flex; border-bottom: 1px solid #f0f0f0;">
        <button (click)="activeTab = 'status'" 
                [class.active]="activeTab === 'status'"
                style="padding: 16px 24px; border: none; background: none; color: #666; cursor: pointer; font-size: 14px; border-bottom: 2px solid transparent;"
                [style.color]="activeTab === 'status' ? '#1890ff' : '#666'"
                [style.border-bottom-color]="activeTab === 'status' ? '#1890ff' : 'transparent'">
          📊 Status
        </button>
        <button (click)="activeTab = 'history'" 
                [class.active]="activeTab === 'history'"
                style="padding: 16px 24px; border: none; background: none; color: #666; cursor: pointer; font-size: 14px; border-bottom: 2px solid transparent;"
                [style.color]="activeTab === 'history' ? '#1890ff' : '#666'"
                [style.border-bottom-color]="activeTab === 'history' ? '#1890ff' : 'transparent'">
          📈 Histórico
        </button>
        <button (click)="activeTab = 'clients'" 
                [class.active]="activeTab === 'clients'"
                style="padding: 16px 24px; border: none; background: none; color: #666; cursor: pointer; font-size: 14px; border-bottom: 2px solid transparent;"
                [style.color]="activeTab === 'clients' ? '#1890ff' : '#666'"
                [style.border-bottom-color]="activeTab === 'clients' ? '#1890ff' : 'transparent'">
          👥 Clientes
        </button>
        <button (click)="activeTab = 'packages'" 
                [class.active]="activeTab === 'packages'"
                style="padding: 16px 24px; border: none; background: none; color: #666; cursor: pointer; font-size: 14px; border-bottom: 2px solid transparent;"
                [style.color]="activeTab === 'packages' ? '#1890ff' : '#666'"
                [style.border-bottom-color]="activeTab === 'packages' ? '#1890ff' : 'transparent'">
          📦 Pacotes
        </button>
      </div>
    </div>

    <!-- Status Tab -->
    <div *ngIf="activeTab === 'status'" class="status-tab">
      <div class="status-control" style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h3 style="margin: 0 0 20px 0; color: #333;">🔄 Alterar Status</h3>
        
        <form [formGroup]="statusForm" (ngSubmit)="updateStatus()">
          <div class="form-group" style="margin-bottom: 20px;">
            <label for="status" style="display: block; margin-bottom: 8px; font-weight: 500; color: #555;">Novo Status:</label>
            <select id="status" 
                    formControlName="status" 
                    style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px; background: white;">
              <option value="">Selecione o status...</option>
              <option *ngFor="let status of availableStatuses" [value]="status.value">
                {{ status.label }}
              </option>
            </select>
          </div>

          <div class="form-group" style="margin-bottom: 30px;">
            <label for="observation" style="display: block; margin-bottom: 8px; font-weight: 500; color: #555;">Observação (opcional):</label>
            <textarea id="observation" 
                      formControlName="observation" 
                      placeholder="Digite uma observação sobre a mudança..."
                      rows="4"
                      style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px; resize: vertical; box-sizing: border-box;"></textarea>
          </div>

          <div style="display: flex; gap: 10px;">
            <button type="submit" 
                    [disabled]="statusForm.invalid || isLoading"
                    style="padding: 12px 24px; background: #52c41a; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;"
                    [style.background]="statusForm.invalid || isLoading ? '#ccc' : '#52c41a'"
                    [style.cursor]="statusForm.invalid || isLoading ? 'not-allowed' : 'pointer'">
              <span *ngIf="!isLoading">💾 Salvar Status</span>
              <span *ngIf="isLoading">⏳ Salvando...</span>
            </button>
            
            <button type="button" 
                    (click)="cancelEdit()"
                    style="padding: 12px 24px; background: #d9d9d9; color: #666; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
              ❌ Cancelar
            </button>
          </div>
        </form>

        <div *ngIf="successMessage" style="margin-top: 20px; padding: 12px; background: #e6ffe6; color: #00b894; border-radius: 6px; font-size: 14px;">
          ✅ {{ successMessage }}
        </div>

        <div *ngIf="errorMessage" style="margin-top: 20px; padding: 12px; background: #ffe6e6; color: #d63031; border-radius: 6px; font-size: 14px;">
          ⚠️ {{ errorMessage }}
        </div>
      </div>

      <!-- Current Status Info -->
      <div class="current-status" style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h4 style="margin: 0 0 15px 0; color: #333;">📋 Informações Atuais</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
          <div>
            <label style="font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Status Atual</label>
            <p style="margin: 5px 0 0 0; font-weight: 500; color: #333;">{{ getStatusText(release.status) }}</p>
          </div>
          <div>
            <label style="font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Última Atualização</label>
            <p style="margin: 5px 0 0 0; font-weight: 500; color: #333;">{{ formatDate(release.updatedAt) }}</p>
          </div>
          <div>
            <label style="font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Responsável</label>
            <p style="margin: 5px 0 0 0; font-weight: 500; color: #333;">{{ release.updatedBy || 'Sistema' }}</p>
          </div>
          <div>
            <label style="font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Criado em</label>
            <p style="margin: 5px 0 0 0; font-weight: 500; color: #333;">{{ formatDate(release.createdAt) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Other tabs content placeholders -->
    <div *ngIf="activeTab === 'history'" style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h3 style="margin: 0 0 20px 0; color: #333;">📈 Histórico de Mudanças</h3>
      <p style="color: #666;">Histórico será implementado na próxima etapa...</p>
    </div>

    <div *ngIf="activeTab === 'clients'" style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h3 style="margin: 0 0 20px 0; color: #333;">👥 Clientes e Ambientes</h3>
      <p style="color: #666;">Gestão de clientes será implementada na próxima etapa...</p>
    </div>

    <div *ngIf="activeTab === 'packages'" style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h3 style="margin: 0 0 20px 0; color: #333;">📦 Pacotes de Distribuição</h3>
      <p style="color: #666;">Gestão de pacotes será implementada na próxima etapa...</p>
    </div>
  </div>`
})
export class ReleaseDetailComponent implements OnInit {
  releaseId: string = '';
  activeTab: string = 'status';
  statusForm!: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  // Mock release data
  release = {
    id: 1,
    name: 'Release 1.2.3',
    version: '1.2.3',
    product: 'Sistema Principal',
    status: 'IN_PROGRESS',
    createdAt: new Date(),
    updatedAt: new Date(),
    updatedBy: 'João Silva'
  };

  // All available statuses from US-02
  availableStatuses = [
    { value: 'MR_APPROVED', label: 'MR Aprovado' },
    { value: 'BUILD_FAILED_TEST', label: 'Falha no Build para Teste' },
    { value: 'READY_FOR_SYSTEM_TEST', label: 'Para Teste de Sistema' },
    { value: 'IN_SYSTEM_TEST', label: 'Em Teste de Sistema' },
    { value: 'FAILED_SYSTEM_TEST', label: 'Reprovada no teste' },
    { value: 'APPROVED_SYSTEM_TEST', label: 'Aprovada no teste' },
    { value: 'BUILD_FAILED_PRODUCTION', label: 'Falha no Build para Produção' },
    { value: 'READY_FOR_REGRESSION_TEST', label: 'Para Teste Regressivo' },
    { value: 'IN_REGRESSION_TEST', label: 'Em Teste Regressivo' },
    { value: 'FAILED_STABLE_INSTALL', label: 'Falha na instalação da Estável' },
    { value: 'INTERNAL', label: 'Interno' },
    { value: 'REVOKED', label: 'Revogada' },
    { value: 'FAILED_REGRESSION_TEST', label: 'Reprovada no teste regressivo' },
    { value: 'APPROVED_REGRESSION_TEST', label: 'Aprovada no teste regressivo' },
    { value: 'CONTROLLED', label: 'Controlada' },
    { value: 'AVAILABLE', label: 'Disponível' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.releaseId = this.route.snapshot.params['id'];
    this.initializeForm();
    this.loadReleaseData();
  }

  private initializeForm(): void {
    this.statusForm = this.fb.group({
      status: ['', [Validators.required]],
      observation: ['']
    });
  }

  private loadReleaseData(): void {
    // Simulate API call to load release data
    // In real implementation, call backend API
    this.release.id = parseInt(this.releaseId) || 1;
  }

  updateStatus(): void {
    if (this.statusForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const statusData = {
        releaseId: this.releaseId,
        newStatus: this.statusForm.value.status,
        observation: this.statusForm.value.observation,
        updatedBy: 'Usuário Atual'
      };

      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        this.release.status = statusData.newStatus;
        this.release.updatedAt = new Date();
        this.release.updatedBy = statusData.updatedBy;
        
        this.successMessage = 'Status atualizado com sucesso!';
        this.statusForm.reset();
        
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      }, 1000);
    }
  }

  cancelEdit(): void {
    this.statusForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'MR_APPROVED': '#108ee9',
      'BUILD_FAILED_TEST': '#ff4d4f',
      'READY_FOR_SYSTEM_TEST': '#1890ff',
      'IN_SYSTEM_TEST': '#722ed1',
      'FAILED_SYSTEM_TEST': '#ff4d4f',
      'APPROVED_SYSTEM_TEST': '#52c41a',
      'BUILD_FAILED_PRODUCTION': '#ff4d4f',
      'READY_FOR_REGRESSION_TEST': '#1890ff',
      'IN_REGRESSION_TEST': '#722ed1',
      'FAILED_STABLE_INSTALL': '#ff4d4f',
      'INTERNAL': '#fa8c16',
      'REVOKED': '#8c8c8c',
      'FAILED_REGRESSION_TEST': '#ff4d4f',
      'APPROVED_REGRESSION_TEST': '#52c41a',
      'CONTROLLED': '#13c2c2',
      'AVAILABLE': '#52c41a',
      'IN_PROGRESS': '#1890ff',
      'COMPLETED': '#52c41a',
      'TESTING': '#fa8c16',
      'PENDING': '#d9d9d9'
    };
    return statusColors[status] || '#d9d9d9';
  }

  getStatusText(status: string): string {
    const statusTexts: { [key: string]: string } = {
      'MR_APPROVED': 'MR Aprovado',
      'BUILD_FAILED_TEST': 'Falha no Build para Teste',
      'READY_FOR_SYSTEM_TEST': 'Para Teste de Sistema',
      'IN_SYSTEM_TEST': 'Em Teste de Sistema',
      'FAILED_SYSTEM_TEST': 'Reprovada no teste',
      'APPROVED_SYSTEM_TEST': 'Aprovada no teste',
      'BUILD_FAILED_PRODUCTION': 'Falha no Build para Produção',
      'READY_FOR_REGRESSION_TEST': 'Para Teste Regressivo',
      'IN_REGRESSION_TEST': 'Em Teste Regressivo',
      'FAILED_STABLE_INSTALL': 'Falha na instalação da Estável',
      'INTERNAL': 'Interno',
      'REVOKED': 'Revogada',
      'FAILED_REGRESSION_TEST': 'Reprovada no teste regressivo',
      'APPROVED_REGRESSION_TEST': 'Aprovada no teste regressivo',
      'CONTROLLED': 'Controlada',
      'AVAILABLE': 'Disponível',
      'IN_PROGRESS': 'Em Progresso',
      'COMPLETED': 'Concluído',
      'TESTING': 'Em Teste',
      'PENDING': 'Pendente'
    };
    return statusTexts[status] || status;
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleString('pt-BR');
  }
}