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

    <div *ngIf="activeTab === 'packages'" class="packages-tab">
      <!-- Upload Package -->
      <div class="upload-package" style="background: white; padding: 30px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h3 style="margin: 0 0 20px 0; color: #333;">📤 Upload de Pacote</h3>
        
        <div style="border: 2px dashed #d9d9d9; border-radius: 8px; padding: 40px; text-align: center; background: #fafafa;">
          <div style="font-size: 48px; margin-bottom: 15px; color: #d9d9d9;">📦</div>
          <h4 style="margin: 0 0 10px 0; color: #333;">Arraste o arquivo ou clique para selecionar</h4>
          <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;">Formatos suportados: .zip, .tar.gz (máx. 500MB)</p>
          
          <input type="file" 
                 id="packageFile" 
                 accept=".zip,.tar.gz" 
                 style="display: none;" 
                 (change)="handleFileSelect($event)">
          <button onclick="document.getElementById('packageFile').click()" 
                  style="padding: 12px 24px; background: #1890ff; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; margin-right: 10px;">
            📁 Selecionar Arquivo
          </button>
          <button (click)="uploadPackage()" 
                  [disabled]="!selectedFile || isUploading"
                  style="padding: 12px 24px; background: #52c41a; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;"
                  [style.background]="!selectedFile || isUploading ? '#ccc' : '#52c41a'"
                  [style.cursor]="!selectedFile || isUploading ? 'not-allowed' : 'pointer'">
            <span *ngIf="!isUploading">🚀 Upload</span>
            <span *ngIf="isUploading">⏳ Enviando...</span>
          </button>
          
          <div *ngIf="selectedFile" style="margin-top: 15px; padding: 10px; background: #e6f7ff; border-radius: 4px; text-align: left;">
            <strong>Arquivo selecionado:</strong> {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
          </div>
        </div>

        <div *ngIf="uploadSuccess" style="margin-top: 20px; padding: 12px; background: #e6ffe6; color: #00b894; border-radius: 6px; font-size: 14px;">
          ✅ {{ uploadSuccess }}
        </div>

        <div *ngIf="uploadError" style="margin-top: 20px; padding: 12px; background: #ffe6e6; color: #d63031; border-radius: 6px; font-size: 14px;">
          ⚠️ {{ uploadError }}
        </div>
      </div>

      <!-- Package List -->
      <div class="package-list" style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
          <h3 style="margin: 0; color: #333;">📋 Pacotes Disponíveis</h3>
          <div style="font-size: 14px; color: #666;">
            Total: {{ packages.length }} pacote(s)
          </div>
        </div>

        <div *ngIf="packages.length > 0" class="packages-grid" style="display: grid; gap: 20px;">
          <div *ngFor="let pkg of packages" 
               class="package-item" 
               style="border: 1px solid #f0f0f0; border-radius: 8px; padding: 20px; transition: all 0.2s;"
               onmouseover="this.style.borderColor='#1890ff'; this.style.backgroundColor='#f6ffed';"
               onmouseout="this.style.borderColor='#f0f0f0'; this.style.backgroundColor='white';">
            
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
              <div>
                <h4 style="margin: 0 0 5px 0; color: #333; font-size: 18px;">{{ pkg.filename }}</h4>
                <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 10px;">
                  <span style="padding: 4px 8px; background: #e6f7ff; color: #1890ff; border-radius: 12px; font-size: 11px; font-weight: 500;">
                    {{ pkg.type }}
                  </span>
                  <span style="padding: 4px 8px; background: #f6ffed; color: #52c41a; border-radius: 12px; font-size: 11px; font-weight: 500;">
                    {{ formatFileSize(pkg.size) }}
                  </span>
                </div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 12px; color: #888; margin-bottom: 5px;">Upload</div>
                <div style="font-size: 14px; color: #333; font-weight: 500;">{{ formatDate(pkg.uploadedAt) }}</div>
              </div>
            </div>

            <div class="package-details" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 6px;">
              <div>
                <label style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Checksum</label>
                <p style="margin: 3px 0 0 0; font-family: 'Monaco', 'Courier New', monospace; font-size: 11px; color: #333; word-break: break-all;">{{ pkg.checksum }}</p>
              </div>
              <div>
                <label style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Downloads</label>
                <p style="margin: 3px 0 0 0; font-weight: 500; color: #333;">{{ pkg.downloadCount }}</p>
              </div>
              <div>
                <label style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Status</label>
                <p style="margin: 3px 0 0 0; font-weight: 500;" [style.color]="getPackageStatusColor(pkg.status)">{{ pkg.status }}</p>
              </div>
              <div>
                <label style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Uploader</label>
                <p style="margin: 3px 0 0 0; font-weight: 500; color: #333;">{{ pkg.uploadedBy }}</p>
              </div>
            </div>

            <div class="package-actions" style="display: flex; gap: 10px; flex-wrap: wrap; padding-top: 15px; border-top: 1px solid #f0f0f0;">
              <button (click)="downloadPackage(pkg)" 
                      [disabled]="pkg.status !== 'Ativo'"
                      style="flex: 1; min-width: 120px; padding: 10px; background: #52c41a; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;"
                      [style.background]="pkg.status !== 'Ativo' ? '#ccc' : '#52c41a'"
                      [style.cursor]="pkg.status !== 'Ativo' ? 'not-allowed' : 'pointer'">
                📥 Download
              </button>
              <button (click)="copyDownloadLink(pkg)" 
                      style="flex: 1; min-width: 120px; padding: 10px; background: #1890ff; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
                🔗 Copiar Link
              </button>
              <button (click)="togglePackageStatus(pkg)" 
                      style="flex: 1; min-width: 120px; padding: 10px; background: #fa8c16; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
                {{ pkg.status === 'Ativo' ? '⏸️ Desabilitar' : '▶️ Ativar' }}
              </button>
              <button (click)="deletePackage(pkg)" 
                      style="flex: 1; min-width: 120px; padding: 10px; background: #ff4757; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
                🗑️ Excluir
              </button>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div *ngIf="packages.length === 0" 
             style="text-align: center; padding: 60px 20px; color: #666;">
          <div style="font-size: 48px; margin-bottom: 20px;">📦</div>
          <h3 style="color: #666; margin-bottom: 10px;">Nenhum pacote encontrado</h3>
          <p>Use a área de upload acima para adicionar pacotes de distribuição.</p>
        </div>
      </div>

      <!-- Package Statistics -->
      <div class="package-stats" style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h4 style="margin: 0 0 15px 0; color: #333;">📊 Estatísticas de Distribuição</h4>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
          <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: #1890ff; margin-bottom: 5px;">
              {{ getTotalPackageSize() }}
            </div>
            <div style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">
              Tamanho Total
            </div>
          </div>
          
          <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: #52c41a; margin-bottom: 5px;">
              {{ getTotalDownloads() }}
            </div>
            <div style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">
              Total Downloads
            </div>
          </div>
          
          <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: #722ed1; margin-bottom: 5px;">
              {{ getActivePackages() }}
            </div>
            <div style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">
              Pacotes Ativos
            </div>
          </div>
          
          <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: #fa8c16; margin-bottom: 5px;">
              {{ getAverageSize() }}
            </div>
            <div style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">
              Tamanho Médio
            </div>
          </div>
        </div>
      </div>
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
  
  // Package management properties (US-07)
  selectedFile: File | null = null;
  isUploading = false;
  uploadSuccess = '';
  uploadError = '';
  
  // Mock packages data for US-07
  packages = [
    {
      id: 1,
      filename: 'sistema-principal-1.2.3.zip',
      type: 'Release',
      size: 25600000,
      checksum: 'sha256:a1b2c3d4e5f67890...',
      uploadedAt: new Date('2024-01-16T10:30:00'),
      uploadedBy: 'João Silva',
      downloadCount: 15,
      status: 'Ativo',
      downloadUrl: '/api/v1/packages/download/1'
    },
    {
      id: 2,
      filename: 'patches-critticos-1.2.3.tar.gz',
      type: 'Patch',
      size: 5120000,
      checksum: 'sha256:f6e5d4c3b2a19087...',
      uploadedAt: new Date('2024-01-15T16:20:00'),
      uploadedBy: 'Maria Santos',
      downloadCount: 8,
      status: 'Ativo',
      downloadUrl: '/api/v1/packages/download/2'
    },
    {
      id: 3,
      filename: 'rollback-1.2.2.zip',
      type: 'Rollback',
      size: 18432000,
      checksum: 'sha256:9876543210abcdef...',
      uploadedAt: new Date('2024-01-14T14:15:00'),
      uploadedBy: 'Carlos Lima',
      downloadCount: 3,
      status: 'Inativo',
      downloadUrl: '/api/v1/packages/download/3'
    }
  ];

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

  // Package Management Methods (US-07)
  handleFileSelect(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 500MB)
      if (file.size > 500 * 1024 * 1024) {
        this.uploadError = 'Arquivo muito grande. Tamanho máximo: 500MB';
        this.uploadSuccess = '';
        return;
      }

      // Validate file type
      const validTypes = ['.zip', '.tar.gz'];
      const isValidType = validTypes.some(type => file.name.toLowerCase().endsWith(type));
      
      if (!isValidType) {
        this.uploadError = 'Tipo de arquivo inválido. Use apenas .zip ou .tar.gz';
        this.uploadSuccess = '';
        return;
      }

      this.selectedFile = file;
      this.uploadError = '';
      this.uploadSuccess = '';
    }
  }

  uploadPackage(): void {
    if (!this.selectedFile) {
      this.uploadError = 'Selecione um arquivo primeiro';
      return;
    }

    this.isUploading = true;
    this.uploadError = '';
    this.uploadSuccess = '';

    // Simulate API call
    setTimeout(() => {
      this.isUploading = false;
      
      const newPackage = {
        id: this.packages.length + 1,
        filename: this.selectedFile!.name,
        type: this.getPackageType(this.selectedFile!.name),
        size: this.selectedFile!.size,
        checksum: 'sha256:' + this.generateMockChecksum(),
        uploadedAt: new Date(),
        uploadedBy: 'Usuário Atual',
        downloadCount: 0,
        status: 'Ativo',
        downloadUrl: `/api/v1/packages/download/${this.packages.length + 1}`
      };

      this.packages.unshift(newPackage);
      this.uploadSuccess = `Pacote ${this.selectedFile!.name} enviado com sucesso!`;
      this.selectedFile = null;
      
      // Reset file input
      const fileInput = document.getElementById('packageFile') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      setTimeout(() => {
        this.uploadSuccess = '';
      }, 5000);
    }, 2000);
  }

  downloadPackage(pkg: any): void {
    if (pkg.status !== 'Ativo') {
      alert('Este pacote está inativo e não pode ser baixado.');
      return;
    }

    // Simulate download
    pkg.downloadCount++;
    this.uploadSuccess = `Download iniciado: ${pkg.filename}`;
    setTimeout(() => {
      this.uploadSuccess = '';
    }, 3000);
  }

  copyDownloadLink(pkg: any): void {
    const baseUrl = window.location.origin;
    const downloadLink = `${baseUrl}${pkg.downloadUrl}?token=secure_token_here`;
    
    navigator.clipboard.writeText(downloadLink).then(() => {
      this.uploadSuccess = `Link copiado para a área de transferência: ${pkg.filename}`;
      setTimeout(() => {
        this.uploadSuccess = '';
      }, 3000);
    }).catch(() => {
      this.uploadError = 'Erro ao copiar link para área de transferência';
      setTimeout(() => {
        this.uploadError = '';
      }, 3000);
    });
  }

  togglePackageStatus(pkg: any): void {
    const newStatus = pkg.status === 'Ativo' ? 'Inativo' : 'Ativo';
    const action = newStatus === 'Ativo' ? 'ativado' : 'desativado';
    
    if (confirm(`Tem certeza que deseja ${action === 'ativado' ? 'ativar' : 'desativar'} o pacote ${pkg.filename}?`)) {
      pkg.status = newStatus;
      this.uploadSuccess = `Pacote ${pkg.filename} foi ${action} com sucesso!`;
      setTimeout(() => {
        this.uploadSuccess = '';
      }, 3000);
    }
  }

  deletePackage(pkg: any): void {
    const confirmMessage = `ATENÇÃO: Esta ação não pode ser desfeita!\n\nTem certeza que deseja excluir permanentemente o pacote "${pkg.filename}"?\n\nEsta ação removerá o arquivo e todo seu histórico de downloads.`;
    
    if (confirm(confirmMessage)) {
      const index = this.packages.indexOf(pkg);
      if (index > -1) {
        this.packages.splice(index, 1);
        this.uploadSuccess = `Pacote ${pkg.filename} foi excluído permanentemente.`;
        setTimeout(() => {
          this.uploadSuccess = '';
        }, 5000);
      }
    }
  }

  // Package Statistics Methods
  getTotalPackageSize(): string {
    const totalBytes = this.packages.reduce((sum, pkg) => sum + pkg.size, 0);
    return this.formatFileSize(totalBytes);
  }

  getTotalDownloads(): number {
    return this.packages.reduce((sum, pkg) => sum + pkg.downloadCount, 0);
  }

  getActivePackages(): number {
    return this.packages.filter(pkg => pkg.status === 'Ativo').length;
  }

  getAverageSize(): string {
    if (this.packages.length === 0) return '0 B';
    const avgBytes = this.packages.reduce((sum, pkg) => sum + pkg.size, 0) / this.packages.length;
    return this.formatFileSize(avgBytes);
  }

  // Utility Methods
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  getPackageType(filename: string): string {
    const lowerFilename = filename.toLowerCase();
    if (lowerFilename.includes('patch')) return 'Patch';
    if (lowerFilename.includes('rollback')) return 'Rollback';
    if (lowerFilename.includes('hotfix')) return 'Hotfix';
    return 'Release';
  }

  getPackageStatusColor(status: string): string {
    return status === 'Ativo' ? '#52c41a' : '#8c8c8c';
  }

  private generateMockChecksum(): string {
    return Math.random().toString(16).substring(2, 18) + '...';
  }
}