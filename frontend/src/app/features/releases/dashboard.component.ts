import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Release, ReleaseService, ReleaseStatus } from '../../core/services/release.service';
import { ClientService, Client } from '../../core/services/client.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

interface DashboardStats {
  totalReleases: number;
  pendingReleases: number;
  approvedReleases: number;
  availableReleases: number;
  failedReleases: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div style="padding: 24px;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h1 nz-typography>Dashboard - Release Manager</h1>
        <div>
          <button nz-button nzType="default" [nzLoading]="loading()" (click)="refreshData()" style="margin-right: 8px;">
            <span nz-icon nzType="sync"></span>
            Atualizar
          </button>
          <button nz-button nzType="primary" (click)="navigateToReleases()">
            <span nz-icon nzType="setting"></span>
            Gerenciar Releases
          </button>
        </div>
      </div>

      @if (loading()) {
        <div style="text-align: center; padding: 60px;">
          <nz-spin nzSize="large"></nz-spin>
          <p style="margin-top: 16px; color: #999;">Carregando dados do dashboard...</p>
        </div>
      } @else if (error()) {
        <nz-alert
          nzType="error"
          [nzMessage]="error()"
          nzShowIcon
          nzClosable>
          <button nz-button nzType="primary" (click)="refreshData()" *nzAlertActions>
            Tentar Novamente
          </button>
        </nz-alert>
      } @else {
        <!-- Statistics Cards -->
        <div nz-row [nzGutter]="[16, 16]" style="margin-bottom: 24px;">
          <div nz-col [nzXs]="24" [nzSm]="12" [nzMd]="8" [nzLg]="6" [nzXl]="4">
            <nz-card>
              <nz-statistic
                [nzValue]="stats().totalReleases"
                nzTitle="Total de Releases"
                [nzPrefix]="totalIcon"
                [nzValueStyle]="{ color: '#1890ff' }">
                <ng-template #totalIcon>
                  <span nz-icon nzType="bar-chart" style="color: #1890ff;"></span>
                </ng-template>
              </nz-statistic>
            </nz-card>
          </div>

          <div nz-col [nzXs]="24" [nzSm]="12" [nzMd]="8" [nzLg]="6" [nzXl]="4">
            <nz-card>
              <nz-statistic
                [nzValue]="stats().pendingReleases"
                nzTitle="Em Andamento"
                [nzPrefix]="pendingIcon"
                [nzValueStyle]="{ color: '#faad14' }">
                <ng-template #pendingIcon>
                  <span nz-icon nzType="clock-circle" style="color: #faad14;"></span>
                </ng-template>
              </nz-statistic>
            </nz-card>
          </div>

          <div nz-col [nzXs]="24" [nzSm]="12" [nzMd]="8" [nzLg]="6" [nzXl]="4">
            <nz-card>
              <nz-statistic
                [nzValue]="stats().approvedReleases"
                nzTitle="Aprovadas"
                [nzPrefix]="approvedIcon"
                [nzValueStyle]="{ color: '#52c41a' }">
                <ng-template #approvedIcon>
                  <span nz-icon nzType="check-circle" style="color: #52c41a;"></span>
                </ng-template>
              </nz-statistic>
            </nz-card>
          </div>

          <div nz-col [nzXs]="24" [nzSm]="12" [nzMd]="8" [nzLg]="6" [nzXl]="4">
            <nz-card>
              <nz-statistic
                [nzValue]="stats().availableReleases"
                nzTitle="Disponíveis"
                [nzPrefix]="availableIcon"
                [nzValueStyle]="{ color: '#13c2c2' }">
                <ng-template #availableIcon>
                  <span nz-icon nzType="rocket" style="color: #13c2c2;"></span>
                </ng-template>
              </nz-statistic>
            </nz-card>
          </div>

          <div nz-col [nzXs]="24" [nzSm]="12" [nzMd]="8" [nzLg]="6" [nzXl]="4">
            <nz-card>
              <nz-statistic
                [nzValue]="stats().failedReleases"
                nzTitle="Com Falhas"
                [nzPrefix]="failedIcon"
                [nzValueStyle]="{ color: '#f5222d' }">
                <ng-template #failedIcon>
                  <span nz-icon nzType="close-circle" style="color: #f5222d;"></span>
                </ng-template>
              </nz-statistic>
            </nz-card>
          </div>
        </div>

        <!-- Timeline dos Status das Releases -->
        <div nz-row [nzGutter]="[24, 24]">
          <div nz-col [nzXs]="24">
            <nz-card nzTitle="Timeline dos Status - Releases Recentes">
              @if (recentReleases().length > 0) {
                <div style="max-height: 500px; overflow-y: auto;">
                  @for (release of recentReleases().slice(0, 10); track release.id) {
                    <div 
                      style="margin-bottom: 24px; padding: 16px; border-radius: 8px; background: #fafafa; cursor: pointer; transition: all 0.3s;"
                      (click)="viewReleaseDetails(release.id)"
                      (mouseenter)="onMouseEnter($event)"
                      (mouseleave)="onMouseLeave($event)">
                      
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <strong style="color: #1890ff;">Plataforma Shift {{ release.version }}</strong>
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <nz-tag [nzColor]="getStatusColor(release.status)">{{ getStatusDisplayName(release.status) }}</nz-tag>
                          <span style="color: #666; font-size: 12px;">{{ formatDate(release.createdAt) }}</span>
                        </div>
                      </div>
                      
                      <!-- Timeline customizada em zigue-zague -->
                      <div style="position: relative; padding: 20px 0;">
                        <!-- Linha horizontal conectora -->
                        <div style="position: absolute; top: 50%; left: 0; right: 0; height: 2px; background: #e8e8e8; z-index: 1;"></div>
                        
                        <!-- Steps -->
                        <div style="display: flex; justify-content: space-between; position: relative; z-index: 2;">
                          @for (step of getCompleteStatusTimeline(); track step.key; let i = $index) {
                            <div style="display: flex; flex-direction: column; align-items: center; flex: 1; position: relative;">
                              
                              <!-- Step content (alternando para cima/baixo) -->
                              <div [style]="i % 2 === 0 ? 'order: 1; margin-bottom: 8px;' : 'order: 2; margin-top: 8px;'">
                                <div style="text-align: center; font-size: 10px; font-weight: 500; line-height: 1.2; max-width: 60px; word-wrap: break-word;">
                                  {{ step.title }}
                                </div>
                              </div>
                              
                              <!-- Círculo do step (sempre no meio) -->
                              <div [style]="'order: ' + (i % 2 === 0 ? '2' : '1') + '; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid; font-size: 10px; background: white;' + getStepStyles(release.status, step.key)">
                                <span nz-icon [nzType]="getStepIcon(release.status, step.key)" style="font-size: 10px;"></span>
                              </div>
                              
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <nz-empty nzNotFoundContent="Nenhuma release encontrada"></nz-empty>
              }
            </nz-card>
          </div>
        </div>

      }
    </div>
  `,
  styles: [`
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
  `],
  imports: [
    CommonModule,
    NzCardModule,
    NzStatisticModule,
    NzButtonModule,
    NzIconModule,
    NzSpinModule,
    NzGridModule,
    NzProgressModule,
    NzTagModule,
    NzAlertModule,
    NzTypographyModule,
    NzEmptyModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  private releaseService = inject(ReleaseService);
  private clientService = inject(ClientService);
  private router = inject(Router);

  releases = signal<Release[]>([]);
  clients = signal<Client[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  stats = computed<DashboardStats>(() => {
    const allReleases = this.releases();
    const totalReleases = allReleases.length;

    const pendingStatuses = ['MR_APROVADO', 'PARA_TESTE_SISTEMA', 'PARA_TESTE_REGRESSIVO'];
    const approvedStatuses = ['APROVADA_TESTE', 'APROVADA_TESTE_REGRESSIVO', 'CONTROLADA'];
    const availableStatuses = ['DISPONIVEL'];
    const failedStatuses = ['FALHA_BUILD_TESTE', 'FALHA_BUILD_PRODUCAO', 'FALHA_INSTALACAO_ESTAVEL', 'REPROVADA_TESTE', 'REPROVADA_TESTE_REGRESSIVO', 'REVOGADA'];

    const pendingReleases = allReleases.filter(r => pendingStatuses.includes(r.status)).length;
    const approvedReleases = allReleases.filter(r => approvedStatuses.includes(r.status)).length;
    const availableReleases = allReleases.filter(r => availableStatuses.includes(r.status)).length;
    const failedReleases = allReleases.filter(r => failedStatuses.includes(r.status)).length;

    return {
      totalReleases,
      pendingReleases,
      approvedReleases,
      availableReleases,
      failedReleases
    };
  });

  recentReleases = computed(() => {
    return this.releases()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.error.set(null);
    
    // Load releases and clients in parallel
    Promise.all([
      this.releaseService.getAllReleases().toPromise(),
      this.clientService.getAllClients().toPromise()
    ]).then(([releases, clients]) => {
      this.releases.set(releases || []);
      this.clients.set(clients || []);
      this.loading.set(false);
    }).catch(error => {
      console.error('Error loading dashboard data:', error);
      this.error.set('Erro ao carregar dados do dashboard. Tente novamente.');
      this.loading.set(false);
    });
  }

  refreshData() {
    this.loadData();
  }

  // Navigation methods
  navigateToReleases() {
    this.router.navigate(['/releases']);
  }

  viewReleaseDetails(releaseId: string) {
    this.router.navigate(['/releases', releaseId]);
  }

  // Utility methods
  getStatusDisplayName(status: string): string {
    const statusMap: Record<string, string> = {
      'MR_APROVADO': 'MR Aprovado',
      'FALHA_BUILD_TESTE': 'Falha no Build para Teste',
      'PARA_TESTE_SISTEMA': 'Para Teste de Sistema',
      'REPROVADA_TESTE': 'Reprovada no Teste',
      'APROVADA_TESTE': 'Aprovada no Teste',
      'FALHA_BUILD_PRODUCAO': 'Falha no Build para Produção',
      'PARA_TESTE_REGRESSIVO': 'Para Teste Regressivo',
      'FALHA_INSTALACAO_ESTAVEL': 'Falha na Instalação da Estável',
      'INTERNO': 'Interno',
      'REVOGADA': 'Revogada',
      'REPROVADA_TESTE_REGRESSIVO': 'Reprovada no Teste Regressivo',
      'APROVADA_TESTE_REGRESSIVO': 'Aprovada no Teste Regressivo',
      'CONTROLADA': 'Controlada',
      'DISPONIVEL': 'Disponível'
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      'MR_APROVADO': 'status-mr-aprovado',
      'PARA_TESTE_SISTEMA': 'status-para-teste',
      'PARA_TESTE_REGRESSIVO': 'status-para-teste',
      'APROVADA_TESTE': 'status-aprovada',
      'APROVADA_TESTE_REGRESSIVO': 'status-aprovada',
      'REPROVADA_TESTE': 'status-reprovada',
      'REPROVADA_TESTE_REGRESSIVO': 'status-reprovada',
      'FALHA_BUILD_TESTE': 'status-falha',
      'FALHA_BUILD_PRODUCAO': 'status-falha',
      'FALHA_INSTALACAO_ESTAVEL': 'status-falha',
      'CONTROLADA': 'status-controlada',
      'DISPONIVEL': 'status-disponivel',
      'REVOGADA': 'status-revogada'
    };
    return statusMap[status] || 'status-mr-aprovado';
  }

  getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      'MR_APROVADO': '#1890ff',
      'PARA_TESTE_SISTEMA': '#faad14',
      'PARA_TESTE_REGRESSIVO': '#faad14',
      'APROVADA_TESTE': '#52c41a',
      'APROVADA_TESTE_REGRESSIVO': '#52c41a',
      'REPROVADA_TESTE': '#f5222d',
      'REPROVADA_TESTE_REGRESSIVO': '#f5222d',
      'FALHA_BUILD_TESTE': '#f5222d',
      'FALHA_BUILD_PRODUCAO': '#f5222d',
      'FALHA_INSTALACAO_ESTAVEL': '#f5222d',
      'CONTROLADA': '#722ed1',
      'DISPONIVEL': '#52c41a',
      'REVOGADA': '#f5222d'
    };
    return colorMap[status] || '#1890ff';
  }

  onMouseEnter(event: Event) {
    const target = event.currentTarget as HTMLElement;
    if (target) {
      target.style.backgroundColor = '#e6f7ff';
      target.style.borderColor = '#1890ff';
      target.style.border = '1px solid #1890ff';
      target.style.transform = 'translateY(-2px)';
      target.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.15)';
    }
  }

  onMouseLeave(event: Event) {
    const target = event.currentTarget as HTMLElement;
    if (target) {
      target.style.backgroundColor = '#fafafa';
      target.style.border = 'none';
      target.style.transform = 'translateY(0)';
      target.style.boxShadow = 'none';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusTimeline(): Array<{key: string, title: string}> {
    return [
      { key: 'MR_APROVADO', title: 'MR Aprovado' },
      { key: 'PARA_TESTE_SISTEMA', title: 'Teste Sistema' },
      { key: 'APROVADA_TESTE', title: 'Aprovada' },
      { key: 'PARA_TESTE_REGRESSIVO', title: 'Teste Regressivo' },
      { key: 'APROVADA_TESTE_REGRESSIVO', title: 'Aprovada Regr.' },
      { key: 'CONTROLADA', title: 'Controlada' },
      { key: 'DISPONIVEL', title: 'Disponível' }
    ];
  }

  getCompleteStatusTimeline(): Array<{key: string, title: string}> {
    return [
      { key: 'MR_APROVADO', title: 'MR Aprovado' },
      { key: 'FALHA_BUILD_TESTE', title: 'Falha Build Teste' },
      { key: 'PARA_TESTE_SISTEMA', title: 'Teste Sistema' },
      { key: 'REPROVADA_TESTE', title: 'Reprovada Teste' },
      { key: 'APROVADA_TESTE', title: 'Aprovada Teste' },
      { key: 'FALHA_BUILD_PRODUCAO', title: 'Falha Build Prod.' },
      { key: 'PARA_TESTE_REGRESSIVO', title: 'Teste Regressivo' },
      { key: 'FALHA_INSTALACAO_ESTAVEL', title: 'Falha Instalação' },
      { key: 'INTERNO', title: 'Interno' },
      { key: 'REVOGADA', title: 'Revogada' },
      { key: 'REPROVADA_TESTE_REGRESSIVO', title: 'Reprovada Regr.' },
      { key: 'APROVADA_TESTE_REGRESSIVO', title: 'Aprovada Regr.' },
      { key: 'CONTROLADA', title: 'Controlada' },
      { key: 'DISPONIVEL', title: 'Disponível' }
    ];
  }

  getCurrentStepIndex(currentStatus: string): number {
    const statusOrder = [
      'MR_APROVADO',
      'FALHA_BUILD_TESTE',
      'PARA_TESTE_SISTEMA',
      'REPROVADA_TESTE',
      'APROVADA_TESTE',
      'FALHA_BUILD_PRODUCAO',
      'PARA_TESTE_REGRESSIVO',
      'FALHA_INSTALACAO_ESTAVEL',
      'INTERNO',
      'REVOGADA',
      'REPROVADA_TESTE_REGRESSIVO',
      'APROVADA_TESTE_REGRESSIVO',
      'CONTROLADA',
      'DISPONIVEL'
    ];
    
    const index = statusOrder.indexOf(currentStatus);
    return index >= 0 ? index : 0;
  }

  getStepStatus(releaseStatus: string, stepStatus: string): 'wait' | 'process' | 'finish' | 'error' {
    // Status de falha que interrompem o fluxo
    const failedStatuses = [
      'FALHA_BUILD_TESTE', 'FALHA_BUILD_PRODUCAO', 'FALHA_INSTALACAO_ESTAVEL', 
      'REPROVADA_TESTE', 'REPROVADA_TESTE_REGRESSIVO', 'REVOGADA'
    ];

    // Status de sucesso no fluxo normal
    const successfulStatuses = [
      'MR_APROVADO', 'PARA_TESTE_SISTEMA', 'APROVADA_TESTE', 
      'PARA_TESTE_REGRESSIVO', 'APROVADA_TESTE_REGRESSIVO', 'CONTROLADA', 'DISPONIVEL'
    ];
    
    // Se o status atual da release é igual ao step atual
    if (releaseStatus === stepStatus) {
      if (failedStatuses.includes(stepStatus)) {
        return 'error';
      } else {
        return 'process';
      }
    }
    
    // Se é um status de falha e não é o atual, fica esmaecido
    if (failedStatuses.includes(stepStatus)) {
      return 'wait';
    }
    
    // Para status de sucesso, verificar se já passou por ele
    if (successfulStatuses.includes(stepStatus)) {
      const currentIndex = this.getCurrentStepIndex(releaseStatus);
      const stepIndex = this.getCompleteStatusTimeline().findIndex(s => s.key === stepStatus);
      
      if (stepIndex < currentIndex && successfulStatuses.includes(releaseStatus)) {
        return 'finish';
      } else if (stepIndex === currentIndex) {
        return 'process';
      }
    }
    
    return 'wait';
  }

  getStepIcon(releaseStatus: string, stepStatus: string): string {
    const status = this.getStepStatus(releaseStatus, stepStatus);
    switch (status) {
      case 'finish':
        return 'check';
      case 'process':
        return 'loading';
      case 'error':
        return 'close';
      default:
        return 'clock-circle';
    }
  }

  getStepStyles(releaseStatus: string, stepStatus: string): string {
    const status = this.getStepStatus(releaseStatus, stepStatus);
    switch (status) {
      case 'finish':
        return ' border-color: #52c41a; color: #52c41a; background: #f6ffed !important;';
      case 'process':
        return ' border-color: #1890ff; color: #1890ff; background: #e6f7ff !important; animation: pulse 2s infinite;';
      case 'error':
        return ' border-color: #f5222d; color: #f5222d; background: #fff2f0 !important;';
      default:
        return ' border-color: #d9d9d9; color: #d9d9d9; background: #fafafa !important;';
    }
  }
}