import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pipeline-integration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  template: `<div class="pipeline-container" style="padding: 20px;">
    <!-- Header -->
    <div class="header" style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h2 style="margin: 0 0 10px 0; color: #333;">🔗 Integração com Pipeline</h2>
      <p style="margin: 0; color: #666;">Configure e monitore a integração com sistemas de CI/CD</p>
    </div>

    <!-- Configuration Status -->
    <div class="config-status" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
      <div class="status-card" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 32px; color: #52c41a; margin-bottom: 10px;">✅</div>
        <h3 style="margin: 0; font-size: 18px; color: #333;">GitLab CI</h3>
        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Conectado e funcionando</p>
      </div>

      <div class="status-card" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 32px; color: #1890ff; margin-bottom: 10px;">🔗</div>
        <h3 style="margin: 0; font-size: 18px; color: #333;">Webhook</h3>
        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">{{ webhookStatus }}</p>
      </div>

      <div class="status-card" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 32px; color: #722ed1; margin-bottom: 10px;">🔄</div>
        <h3 style="margin: 0; font-size: 18px; color: #333;">Auto-Deploy</h3>
        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">{{ autoDeployEnabled ? 'Ativado' : 'Desativado' }}</p>
      </div>

      <div class="status-card" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 32px; color: #fa8c16; margin-bottom: 10px;">📊</div>
        <h3 style="margin: 0; font-size: 18px; color: #333;">Builds Hoje</h3>
        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">{{ todayBuilds }}</p>
      </div>
    </div>

    <!-- Pipeline Configuration -->
    <div class="pipeline-config" style="background: white; padding: 30px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h3 style="margin: 0 0 20px 0; color: #333;">⚙️ Configuração da Pipeline</h3>
      
      <form [formGroup]="configForm" (ngSubmit)="saveConfiguration()">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 25px;">
          <div class="form-group">
            <label for="gitlabUrl" style="display: block; margin-bottom: 8px; font-weight: 500; color: #555;">URL do GitLab:</label>
            <input id="gitlabUrl" 
                   type="url" 
                   formControlName="gitlabUrl" 
                   placeholder="https://gitlab.empresa.com.br"
                   style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;"
                   [style.border-color]="isFieldInvalid('gitlabUrl') ? '#ff4757' : '#ddd'">
            <div *ngIf="isFieldInvalid('gitlabUrl')" style="color: #ff4757; font-size: 12px; margin-top: 4px;">
              URL do GitLab é obrigatória
            </div>
          </div>

          <div class="form-group">
            <label for="projectId" style="display: block; margin-bottom: 8px; font-weight: 500; color: #555;">ID do Projeto:</label>
            <input id="projectId" 
                   type="text" 
                   formControlName="projectId" 
                   placeholder="123456"
                   style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;"
                   [style.border-color]="isFieldInvalid('projectId') ? '#ff4757' : '#ddd'">
            <div *ngIf="isFieldInvalid('projectId')" style="color: #ff4757; font-size: 12px; margin-top: 4px;">
              ID do projeto é obrigatório
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 25px;">
          <div class="form-group">
            <label for="accessToken" style="display: block; margin-bottom: 8px; font-weight: 500; color: #555;">Token de Acesso:</label>
            <input id="accessToken" 
                   type="password" 
                   formControlName="accessToken" 
                   placeholder="glpat-xxxxxxxxxxxxxxxxxxxx"
                   style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;"
                   [style.border-color]="isFieldInvalid('accessToken') ? '#ff4757' : '#ddd'">
            <div *ngIf="isFieldInvalid('accessToken')" style="color: #ff4757; font-size: 12px; margin-top: 4px;">
              Token de acesso é obrigatório
            </div>
          </div>

          <div class="form-group">
            <label for="targetBranch" style="display: block; margin-bottom: 8px; font-weight: 500; color: #555;">Branch Principal:</label>
            <input id="targetBranch" 
                   type="text" 
                   formControlName="targetBranch" 
                   placeholder="main"
                   style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
          </div>
        </div>

        <div class="form-group" style="margin-bottom: 25px;">
          <label style="display: flex; align-items: center; font-weight: 500; color: #555;">
            <input type="checkbox" 
                   formControlName="autoRelease" 
                   style="margin-right: 8px; transform: scale(1.2);">
            Criar release automaticamente após build bem-sucedido
          </label>
        </div>

        <div style="display: flex; gap: 10px;">
          <button type="submit" 
                  [disabled]="configForm.invalid || isSaving"
                  style="padding: 12px 24px; background: #52c41a; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;"
                  [style.background]="configForm.invalid || isSaving ? '#ccc' : '#52c41a'"
                  [style.cursor]="configForm.invalid || isSaving ? 'not-allowed' : 'pointer'">
            <span *ngIf="!isSaving">💾 Salvar Configuração</span>
            <span *ngIf="isSaving">⏳ Salvando...</span>
          </button>
          
          <button type="button" 
                  (click)="testConnection()"
                  [disabled]="configForm.invalid || isTesting"
                  style="padding: 12px 24px; background: #1890ff; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;"
                  [style.background]="configForm.invalid || isTesting ? '#ccc' : '#1890ff'"
                  [style.cursor]="configForm.invalid || isTesting ? 'not-allowed' : 'pointer'">
            <span *ngIf="!isTesting">🔍 Testar Conexão</span>
            <span *ngIf="isTesting">⏳ Testando...</span>
          </button>
        </div>
      </form>

      <div *ngIf="configMessage" style="margin-top: 20px; padding: 12px; border-radius: 6px; font-size: 14px;"
           [style.background]="isConfigSuccess ? '#e6ffe6' : '#ffe6e6'"
           [style.color]="isConfigSuccess ? '#00b894' : '#d63031'">
        {{ isConfigSuccess ? '✅' : '⚠️' }} {{ configMessage }}
      </div>
    </div>

    <!-- Recent Pipeline Runs -->
    <div class="recent-runs" style="background: white; padding: 30px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h3 style="margin: 0 0 20px 0; color: #333;">🚀 Execuções Recentes da Pipeline</h3>
      
      <div class="runs-list">
        <div *ngFor="let run of pipelineRuns" 
             class="run-item" 
             style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border: 1px solid #f0f0f0; border-radius: 8px; margin-bottom: 15px;">
          
          <div class="run-info" style="display: flex; align-items: center; gap: 15px;">
            <div class="status-icon" [style.color]="getRunStatusColor(run.status)">
              {{ getRunStatusIcon(run.status) }}
            </div>
            <div>
              <h4 style="margin: 0 0 5px 0; color: #333; font-size: 16px;">{{ run.pipelineId }}</h4>
              <div style="font-size: 12px; color: #666;">
                {{ run.branch }} • {{ run.commit.substring(0, 8) }} • {{ run.triggeredBy }}
              </div>
            </div>
          </div>

          <div class="run-details" style="text-align: right;">
            <div style="font-weight: 500; color: #333; margin-bottom: 5px;">
              {{ getDuration(run.startTime, run.endTime) }}
            </div>
            <div style="font-size: 12px; color: #666;">
              {{ formatDate(run.startTime) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Webhook Configuration -->
    <div class="webhook-config" style="background: white; padding: 30px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h3 style="margin: 0 0 20px 0; color: #333;">🔗 Configuração do Webhook</h3>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px 0; color: #333; font-size: 14px;">URL do Webhook:</h4>
        <div style="font-family: 'Monaco', 'Courier New', monospace; background: #2d3748; color: #e2e8f0; padding: 15px; border-radius: 4px; font-size: 12px; word-break: break-all;">
          {{ webhookUrl }}
        </div>
        <button (click)="copyWebhookUrl()" 
                style="margin-top: 10px; padding: 8px 16px; background: #1890ff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
          📋 Copiar URL
        </button>
      </div>

      <div style="background: #fff7e6; padding: 15px; border-radius: 6px; border-left: 4px solid #fa8c16;">
        <h4 style="margin: 0 0 10px 0; color: #fa8c16; font-size: 14px;">📋 Eventos Suportados:</h4>
        <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 13px;">
          <li>Pipeline success/failure</li>
          <li>Build completion</li>
          <li>Merge request events</li>
          <li>Tag creation</li>
        </ul>
      </div>
    </div>

    <!-- Integration Logs -->
    <div class="integration-logs" style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3 style="margin: 0; color: #333;">📋 Logs de Integração</h3>
        <button (click)="refreshLogs()" 
                style="padding: 8px 16px; background: #1890ff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
          🔄 Atualizar
        </button>
      </div>
      
      <div class="logs-container" style="font-family: 'Monaco', 'Courier New', monospace; background: #1e1e1e; color: #d4d4d4; padding: 20px; border-radius: 6px; max-height: 300px; overflow-y: auto;">
        <div *ngFor="let log of integrationLogs" 
             style="margin-bottom: 5px; font-size: 12px;"
             [style.color]="getLogColor(log.level)">
          [{{ formatLogTime(log.timestamp) }}] {{ log.level.toUpperCase() }}: {{ log.message }}
        </div>
      </div>
    </div>
  </div>`
})
export class PipelineIntegrationComponent implements OnInit {
  configForm!: FormGroup;
  isSaving = false;
  isTesting = false;
  configMessage = '';
  isConfigSuccess = false;
  
  webhookStatus = 'Configurado e ativo';
  autoDeployEnabled = true;
  todayBuilds = 12;
  webhookUrl = 'https://release-manager.empresa.com.br/api/webhooks/gitlab';

  // Mock pipeline runs data
  pipelineRuns = [
    {
      pipelineId: 'pipeline-#1234',
      status: 'success',
      branch: 'feature/nova-funcionalidade',
      commit: 'a1b2c3d4e5f6789012345678901234567890abcd',
      triggeredBy: 'João Silva',
      startTime: new Date('2024-01-16T14:30:00'),
      endTime: new Date('2024-01-16T14:45:30')
    },
    {
      pipelineId: 'pipeline-#1233',
      status: 'failed',
      branch: 'main',
      commit: 'b2c3d4e5f6789012345678901234567890abcdef',
      triggeredBy: 'Maria Santos',
      startTime: new Date('2024-01-16T13:15:00'),
      endTime: new Date('2024-01-16T13:18:45')
    },
    {
      pipelineId: 'pipeline-#1232',
      status: 'running',
      branch: 'release/1.2.4',
      commit: 'c3d4e5f6789012345678901234567890abcdef12',
      triggeredBy: 'Carlos Lima',
      startTime: new Date('2024-01-16T12:00:00'),
      endTime: null
    }
  ];

  // Mock integration logs
  integrationLogs = [
    { timestamp: new Date('2024-01-16T15:30:45'), level: 'info', message: 'Webhook received from GitLab: pipeline-#1234 succeeded' },
    { timestamp: new Date('2024-01-16T15:30:46'), level: 'info', message: 'Processing pipeline success event' },
    { timestamp: new Date('2024-01-16T15:30:47'), level: 'info', message: 'Creating new release: 1.2.3-rc.1' },
    { timestamp: new Date('2024-01-16T15:30:50'), level: 'success', message: 'Release created successfully with ID: REL-2024-001' },
    { timestamp: new Date('2024-01-16T13:18:45'), level: 'error', message: 'Pipeline pipeline-#1233 failed: Build step failed' },
    { timestamp: new Date('2024-01-16T13:18:46'), level: 'warn', message: 'Skipping release creation due to pipeline failure' },
    { timestamp: new Date('2024-01-16T12:00:15'), level: 'info', message: 'Pipeline pipeline-#1232 started for branch release/1.2.4' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadConfiguration();
  }

  private initializeForm(): void {
    this.configForm = this.fb.group({
      gitlabUrl: ['https://gitlab.empresa.com.br', [Validators.required]],
      projectId: ['123456', [Validators.required]],
      accessToken: ['glpat-xxxxxxxxxxxxxxxxxxxx', [Validators.required]],
      targetBranch: ['main'],
      autoRelease: [true]
    });
  }

  private loadConfiguration(): void {
    // In real implementation, load configuration from backend
    // For demo purposes, form is already populated with default values
  }

  saveConfiguration(): void {
    if (this.configForm.valid) {
      this.isSaving = true;
      this.configMessage = '';

      // Simulate API call
      setTimeout(() => {
        this.isSaving = false;
        this.isConfigSuccess = true;
        this.configMessage = 'Configuração salva com sucesso!';
        
        setTimeout(() => {
          this.configMessage = '';
        }, 5000);
      }, 1500);
    } else {
      this.markFormGroupTouched();
    }
  }

  testConnection(): void {
    if (this.configForm.valid) {
      this.isTesting = true;
      this.configMessage = '';

      // Simulate API call to test connection
      setTimeout(() => {
        this.isTesting = false;
        this.isConfigSuccess = true;
        this.configMessage = 'Conexão testada com sucesso! GitLab acessível e token válido.';
        
        setTimeout(() => {
          this.configMessage = '';
        }, 5000);
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  copyWebhookUrl(): void {
    navigator.clipboard.writeText(this.webhookUrl).then(() => {
      this.isConfigSuccess = true;
      this.configMessage = 'URL do webhook copiada para a área de transferência!';
      setTimeout(() => {
        this.configMessage = '';
      }, 3000);
    });
  }

  refreshLogs(): void {
    // Simulate refresh by adding a new log entry
    const newLog = {
      timestamp: new Date(),
      level: 'info',
      message: 'Logs atualizados manualmente'
    };
    this.integrationLogs.unshift(newLog);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.configForm.controls).forEach(key => {
      const control = this.configForm.get(key);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.configForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getRunStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'success': '#52c41a',
      'failed': '#ff4d4f',
      'running': '#1890ff',
      'pending': '#fa8c16'
    };
    return colors[status] || '#d9d9d9';
  }

  getRunStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'success': '✅',
      'failed': '❌',
      'running': '🔄',
      'pending': '⏳'
    };
    return icons[status] || '❓';
  }

  getDuration(startTime: Date, endTime: Date | null): string {
    if (!endTime) return 'Em execução...';
    
    const diff = endTime.getTime() - startTime.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }

  getLogColor(level: string): string {
    const colors: { [key: string]: string } = {
      'error': '#ff6b6b',
      'warn': '#ffa726',
      'info': '#64b5f6',
      'success': '#66bb6a'
    };
    return colors[level] || '#d4d4d4';
  }

  formatDate(date: Date): string {
    return date.toLocaleString('pt-BR');
  }

  formatLogTime(date: Date): string {
    return date.toLocaleTimeString('pt-BR');
  }
}