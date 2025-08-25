import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-release-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  template: `<div class="release-history-container" style="padding: 20px;">
    <!-- Header -->
    <div class="header" style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2 style="margin: 0 0 5px 0; color: #333;">📈 Histórico de Mudanças</h2>
          <p style="margin: 0; color: #666; font-size: 14px;">Release {{ releaseId }} • Histórico imutável e auditável</p>
        </div>
        <button [routerLink]="['/dashboard/releases', releaseId]" 
                style="background: #1890ff; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px;">
          ← Voltar ao Release
        </button>
      </div>
    </div>

    <!-- Timeline -->
    <div class="history-timeline" style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h3 style="margin: 0 0 30px 0; color: #333;">⏱️ Timeline de Alterações</h3>
      
      <div class="timeline" style="position: relative;">
        <!-- Timeline line -->
        <div style="position: absolute; left: 30px; top: 0; bottom: 0; width: 2px; background: #e8e8e8;"></div>

        <div *ngFor="let entry of historyEntries; let i = index" 
             class="timeline-entry" 
             style="position: relative; margin-bottom: 30px; padding-left: 70px;">
          
          <!-- Timeline dot -->
          <div [style.background-color]="getStatusColor(entry.newStatus)"
               style="position: absolute; left: 21px; top: 5px; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></div>
          
          <!-- Entry content -->
          <div class="entry-content" 
               style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid;"
               [style.border-left-color]="getStatusColor(entry.newStatus)">
            
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
              <div>
                <h4 style="margin: 0 0 5px 0; color: #333; font-size: 16px;">
                  {{ getStatusChangeText(entry.previousStatus, entry.newStatus) }}
                </h4>
                <div style="display: flex; gap: 15px; font-size: 12px; color: #666;">
                  <span>👤 {{ entry.updatedBy }}</span>
                  <span>📅 {{ formatDateTime(entry.timestamp) }}</span>
                  <span>🆔 ID: {{ entry.id }}</span>
                </div>
              </div>
              <div style="display: flex; gap: 10px;">
                <span class="status-badge" 
                      [style.background-color]="getStatusColor(entry.previousStatus)"
                      style="padding: 4px 8px; border-radius: 12px; color: white; font-size: 11px; font-weight: 500;">
                  {{ getStatusText(entry.previousStatus) || 'Inicial' }}
                </span>
                <span style="color: #666; font-size: 14px;">→</span>
                <span class="status-badge" 
                      [style.background-color]="getStatusColor(entry.newStatus)"
                      style="padding: 4px 8px; border-radius: 12px; color: white; font-size: 11px; font-weight: 500;">
                  {{ getStatusText(entry.newStatus) }}
                </span>
              </div>
            </div>

            <div *ngIf="entry.observation" 
                 style="margin-top: 15px; padding: 12px; background: white; border-radius: 4px; border: 1px solid #e8e8e8;">
              <label style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 5px;">
                📝 Observação
              </label>
              <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.4;">
                {{ entry.observation }}
              </p>
            </div>

            <!-- Audit info -->
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e8e8e8;">
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; font-size: 11px; color: #888;">
                <div>
                  <strong>IP:</strong> {{ entry.auditInfo.ipAddress }}
                </div>
                <div>
                  <strong>User Agent:</strong> {{ entry.auditInfo.userAgent }}
                </div>
                <div>
                  <strong>Sessão:</strong> {{ entry.auditInfo.sessionId }}
                </div>
                <div>
                  <strong>Hash:</strong> {{ entry.auditInfo.changeHash }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div *ngIf="historyEntries.length === 0" 
           style="text-align: center; padding: 60px 20px; color: #666;">
        <div style="font-size: 48px; margin-bottom: 20px;">📜</div>
        <h3 style="color: #666; margin-bottom: 10px;">Nenhum histórico encontrado</h3>
        <p>Este release ainda não possui histórico de mudanças.</p>
      </div>
    </div>

    <!-- Statistics -->
    <div class="history-stats" style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h4 style="margin: 0 0 15px 0; color: #333;">📊 Estatísticas do Histórico</h4>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
        <div style="text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: #1890ff; margin-bottom: 5px;">
            {{ historyEntries.length }}
          </div>
          <div style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">
            Total de Mudanças
          </div>
        </div>
        
        <div style="text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: #52c41a; margin-bottom: 5px;">
            {{ getUniqueUsers() }}
          </div>
          <div style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">
            Usuários Envolvidos
          </div>
        </div>
        
        <div style="text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: #722ed1; margin-bottom: 5px;">
            {{ getDaysInProcess() }}
          </div>
          <div style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">
            Dias em Processo
          </div>
        </div>
        
        <div style="text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: #fa8c16; margin-bottom: 5px;">
            {{ getFailureRate() }}%
          </div>
          <div style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">
            Taxa de Falhas
          </div>
        </div>
      </div>
    </div>

    <!-- Export Options -->
    <div class="export-options" style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h4 style="margin: 0 0 15px 0; color: #333;">📤 Exportar Histórico</h4>
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <button (click)="exportHistory('pdf')" 
                style="padding: 10px 20px; background: #ff4757; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
          📄 PDF
        </button>
        <button (click)="exportHistory('excel')" 
                style="padding: 10px 20px; background: #2ed573; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
          📊 Excel
        </button>
        <button (click)="exportHistory('csv')" 
                style="padding: 10px 20px; background: #1890ff; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
          📋 CSV
        </button>
        <button (click)="exportHistory('json')" 
                style="padding: 10px 20px; background: #8c8c8c; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
          💾 JSON
        </button>
      </div>
    </div>
  </div>`
})
export class ReleaseHistoryComponent implements OnInit {
  releaseId: string = '';

  // Mock history data - demonstrating immutable history (US-03)
  historyEntries = [
    {
      id: 'hist_001',
      releaseId: 1,
      previousStatus: null,
      newStatus: 'MR_APPROVED',
      observation: 'Release criada automaticamente pela pipeline após aprovação do MR #1234',
      updatedBy: 'Sistema Pipeline',
      timestamp: new Date('2024-01-15T09:30:00'),
      auditInfo: {
        ipAddress: '192.168.1.10',
        userAgent: 'GitLab Runner/v15.0',
        sessionId: 'sess_pipeline_001',
        changeHash: 'sha256:a1b2c3d4e5f6'
      }
    },
    {
      id: 'hist_002', 
      releaseId: 1,
      previousStatus: 'MR_APPROVED',
      newStatus: 'READY_FOR_SYSTEM_TEST',
      observation: 'Build executado com sucesso. Artefatos gerados e disponíveis para teste.',
      updatedBy: 'DevOps João',
      timestamp: new Date('2024-01-15T10:45:00'),
      auditInfo: {
        ipAddress: '192.168.1.25',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        sessionId: 'sess_user_002',
        changeHash: 'sha256:f6e5d4c3b2a1'
      }
    },
    {
      id: 'hist_003',
      releaseId: 1,
      previousStatus: 'READY_FOR_SYSTEM_TEST',
      newStatus: 'IN_SYSTEM_TEST',
      observation: 'Iniciando bateria de testes de sistema. QA Team assumiu a responsabilidade.',
      updatedBy: 'QA Maria Silva',
      timestamp: new Date('2024-01-15T14:20:00'),
      auditInfo: {
        ipAddress: '192.168.1.35',
        userAgent: 'Mozilla/5.0 (Mac; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        sessionId: 'sess_user_003',
        changeHash: 'sha256:123abc456def'
      }
    },
    {
      id: 'hist_004',
      releaseId: 1,
      previousStatus: 'IN_SYSTEM_TEST',
      newStatus: 'FAILED_SYSTEM_TEST',
      observation: 'Teste falhou: Issue #5678 - Problema na integração com módulo de pagamento. Necessário correção antes de prosseguir.',
      updatedBy: 'QA Maria Silva',
      timestamp: new Date('2024-01-16T08:15:00'),
      auditInfo: {
        ipAddress: '192.168.1.35',
        userAgent: 'Mozilla/5.0 (Mac; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        sessionId: 'sess_user_003',
        changeHash: 'sha256:def456abc123'
      }
    },
    {
      id: 'hist_005',
      releaseId: 1,
      previousStatus: 'FAILED_SYSTEM_TEST',
      newStatus: 'READY_FOR_SYSTEM_TEST',
      observation: 'Correção implementada via hotfix. Nova versão disponível para reteste.',
      updatedBy: 'Dev Carlos Santos',
      timestamp: new Date('2024-01-16T16:30:00'),
      auditInfo: {
        ipAddress: '192.168.1.45',
        userAgent: 'Mozilla/5.0 (Ubuntu; Linux x86_64) AppleWebKit/537.36',
        sessionId: 'sess_user_004',
        changeHash: 'sha256:789ghi012jkl'
      }
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.releaseId = this.route.snapshot.params['id'];
    this.loadHistoryData();
  }

  private loadHistoryData(): void {
    // In real implementation, load history from backend API
    // History is immutable - only INSERT operations allowed (US-03)
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
      'AVAILABLE': 'Disponível'
    };
    return statusTexts[status] || status;
  }

  getStatusColor(status: string | null): string {
    if (!status) return '#d9d9d9';
    
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
      'AVAILABLE': '#52c41a'
    };
    return statusColors[status] || '#d9d9d9';
  }

  getStatusChangeText(previousStatus: string | null, newStatus: string): string {
    if (!previousStatus) {
      return `Release criada com status: ${this.getStatusText(newStatus)}`;
    }
    return `Status alterado para: ${this.getStatusText(newStatus)}`;
  }

  formatDateTime(date: Date): string {
    return date.toLocaleString('pt-BR');
  }

  getUniqueUsers(): number {
    const users = new Set(this.historyEntries.map(entry => entry.updatedBy));
    return users.size;
  }

  getDaysInProcess(): number {
    if (this.historyEntries.length === 0) return 0;
    
    const firstEntry = this.historyEntries[0];
    const lastEntry = this.historyEntries[this.historyEntries.length - 1];
    const diffTime = lastEntry.timestamp.getTime() - firstEntry.timestamp.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getFailureRate(): number {
    const totalEntries = this.historyEntries.length;
    if (totalEntries === 0) return 0;
    
    const failureStatuses = ['FAILED_SYSTEM_TEST', 'FAILED_REGRESSION_TEST', 'BUILD_FAILED_TEST', 'BUILD_FAILED_PRODUCTION', 'FAILED_STABLE_INSTALL'];
    const failures = this.historyEntries.filter(entry => 
      failureStatuses.includes(entry.newStatus)
    ).length;
    
    return Math.round((failures / totalEntries) * 100);
  }

  exportHistory(format: string): void {
    // Simulate export functionality
    const exportData = {
      releaseId: this.releaseId,
      exportDate: new Date().toISOString(),
      format: format,
      entries: this.historyEntries.length,
      data: this.historyEntries
    };

    console.log(`Exporting history as ${format}:`, exportData);
    
    // In real implementation, call backend API to generate export file
    alert(`Histórico será exportado como ${format.toUpperCase()}. Esta funcionalidade será implementada na integração com o backend.`);
  }
}