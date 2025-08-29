import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Release, ReleaseService, ReleaseStatus } from '../../core/services/release.service';
import { ClientService, Client } from '../../core/services/client.service';

interface DashboardStats {
  totalReleases: number;
  pendingReleases: number;
  approvedReleases: number;
  availableReleases: number;
  failedReleases: number;
  statusDistribution: Array<{ status: string; count: number; percentage: number }>;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h2>Dashboard - Release Manager</h2>
        <div class="header-actions">
          <button (click)="refreshData()" class="btn btn-secondary" [disabled]="loading()">
            {{ loading() ? 'Atualizando...' : 'Atualizar' }}
          </button>
          <button (click)="navigateToReleases()" class="btn btn-primary">
            Gerenciar Releases
          </button>
        </div>
      </div>

      @if (loading()) {
        <div class="loading">
          <div class="loading-spinner"></div>
          <p>Carregando dados do dashboard...</p>
        </div>
      } @else if (error()) {
        <div class="error-card">
          <p>{{ error() }}</p>
          <button (click)="refreshData()" class="btn btn-primary">Tentar Novamente</button>
        </div>
      } @else {
        <!-- Statistics Cards -->
        <div class="stats-grid">
          <div class="stat-card total">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <h3>{{ stats().totalReleases }}</h3>
              <p>Total de Releases</p>
            </div>
          </div>

          <div class="stat-card pending">
            <div class="stat-icon">⏳</div>
            <div class="stat-content">
              <h3>{{ stats().pendingReleases }}</h3>
              <p>Em Andamento</p>
            </div>
          </div>

          <div class="stat-card approved">
            <div class="stat-icon">✅</div>
            <div class="stat-content">
              <h3>{{ stats().approvedReleases }}</h3>
              <p>Aprovadas</p>
            </div>
          </div>

          <div class="stat-card available">
            <div class="stat-icon">🚀</div>
            <div class="stat-content">
              <h3>{{ stats().availableReleases }}</h3>
              <p>Disponíveis</p>
            </div>
          </div>

          <div class="stat-card failed">
            <div class="stat-icon">❌</div>
            <div class="stat-content">
              <h3>{{ stats().failedReleases }}</h3>
              <p>Com Falhas</p>
            </div>
          </div>
        </div>

        <!-- Status Distribution -->
        <div class="dashboard-grid">
          <div class="status-distribution-card">
            <h3>Distribuição por Status</h3>
            <div class="status-chart">
              @for (item of stats().statusDistribution; track item.status) {
                <div class="status-bar">
                  <div class="status-info">
                    <span class="status-name">{{ getStatusDisplayName(item.status) }}</span>
                    <span class="status-count">{{ item.count }} ({{ item.percentage }}%)</span>
                  </div>
                  <div class="status-progress">
                    <div 
                      class="status-fill" 
                      [class]="getStatusClass(item.status)"
                      [style.width.%]="item.percentage">
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Recent Releases -->
          <div class="recent-releases-card">
            <h3>Releases Recentes</h3>
            <div class="recent-releases-list">
              @for (release of recentReleases(); track release.id) {
                <div class="release-item" (click)="viewReleaseDetails(release.id)">
                  <div class="release-info">
                    <strong>{{ release.version }}</strong>
                    <span class="release-date">{{ formatDate(release.createdAt) }}</span>
                  </div>
                  <span class="status-badge" [class]="getStatusClass(release.status)">
                    {{ getStatusDisplayName(release.status) }}
                  </span>
                </div>
              } @empty {
                <div class="empty-state">
                  <p>Nenhuma release encontrada</p>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions-card">
          <h3>Ações Rápidas</h3>
          <div class="actions-grid">
            <button (click)="navigateToCreateRelease()" class="action-btn create">
              <div class="action-icon">➕</div>
              <span>Nova Release</span>
            </button>
            <button (click)="navigateToReleases()" class="action-btn manage">
              <div class="action-icon">📝</div>
              <span>Gerenciar Releases</span>
            </button>
            <button (click)="navigateToClients()" class="action-btn clients">
              <div class="action-icon">👥</div>
              <span>Gerenciar Clientes</span>
            </button>
            <button (click)="navigateToVersions()" class="action-btn versions">
              <div class="action-icon">📋</div>
              <span>Versões Disponíveis</span>
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .dashboard-header h2 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.8rem;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .btn {
      padding: 10px 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .btn-primary {
      background: #3498db;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #2980b9;
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: #95a5a6;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #7f8c8d;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px;
      color: #7f8c8d;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e9ecef;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-card {
      background: #fff5f5;
      border: 1px solid #fed7d7;
      color: #e53e3e;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 20px;
    }

    /* Statistics Cards */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 16px;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }

    .stat-icon {
      font-size: 2rem;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
    }

    .stat-card.total .stat-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .stat-card.pending .stat-icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .stat-card.approved .stat-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
    .stat-card.available .stat-icon { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
    .stat-card.failed .stat-icon { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }

    .stat-content h3 {
      margin: 0 0 4px 0;
      font-size: 2rem;
      font-weight: 700;
      color: #2c3e50;
    }

    .stat-content p {
      margin: 0;
      color: #7f8c8d;
      font-size: 0.9rem;
      font-weight: 500;
    }

    /* Dashboard Grid */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 30px;
      margin-bottom: 30px;
    }

    @media (max-width: 768px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Status Distribution */
    .status-distribution-card {
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .status-distribution-card h3 {
      margin: 0 0 20px 0;
      color: #2c3e50;
      font-size: 1.2rem;
    }

    .status-chart {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .status-bar {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .status-info {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
    }

    .status-name {
      color: #2c3e50;
      font-weight: 500;
    }

    .status-count {
      color: #7f8c8d;
    }

    .status-progress {
      height: 8px;
      background: #ecf0f1;
      border-radius: 4px;
      overflow: hidden;
    }

    .status-fill {
      height: 100%;
      transition: width 0.3s ease;
    }

    /* Status Colors */
    .status-mr-aprovado, .status-mr-aprovado .status-fill { background: #3498db; }
    .status-para-teste, .status-para-teste .status-fill { background: #f39c12; }
    .status-aprovada, .status-aprovada .status-fill { background: #27ae60; }
    .status-reprovada, .status-reprovada .status-fill { background: #e74c3c; }
    .status-falha, .status-falha .status-fill { background: #e74c3c; }
    .status-controlada, .status-controlada .status-fill { background: #95a5a6; }
    .status-disponivel, .status-disponivel .status-fill { background: #27ae60; }
    .status-revogada, .status-revogada .status-fill { background: #e74c3c; }

    /* Recent Releases */
    .recent-releases-card {
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .recent-releases-card h3 {
      margin: 0 0 20px 0;
      color: #2c3e50;
      font-size: 1.2rem;
    }

    .recent-releases-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .release-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .release-item:hover {
      background: #e9ecef;
      transform: translateX(4px);
    }

    .release-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .release-info strong {
      color: #2c3e50;
      font-size: 0.95rem;
    }

    .release-date {
      color: #7f8c8d;
      font-size: 0.8rem;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      color: white;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #7f8c8d;
    }

    .empty-state p {
      margin: 0;
    }

    /* Quick Actions */
    .quick-actions-card {
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .quick-actions-card h3 {
      margin: 0 0 20px 0;
      color: #2c3e50;
      font-size: 1.2rem;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 16px;
    }

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 20px;
      background: white;
      border: 2px solid #ecf0f1;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s;
      text-decoration: none;
      color: #2c3e50;
    }

    .action-btn:hover {
      border-color: #3498db;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
    }

    .action-icon {
      font-size: 1.5rem;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .action-btn.create .action-icon { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
    .action-btn.manage .action-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
    .action-btn.clients .action-icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .action-btn.versions .action-icon { background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); }

    .action-btn span {
      font-size: 0.9rem;
      font-weight: 500;
    }
  `],
  imports: [CommonModule],
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
    
    const statusCounts = allReleases.reduce((acc, release) => {
      acc[release.status] = (acc[release.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const pendingStatuses = ['MR_APROVADO', 'PARA_TESTE_SISTEMA', 'PARA_TESTE_REGRESSIVO'];
    const approvedStatuses = ['APROVADA_TESTE', 'APROVADA_TESTE_REGRESSIVO', 'CONTROLADA'];
    const availableStatuses = ['DISPONIVEL'];
    const failedStatuses = ['FALHA_BUILD_TESTE', 'FALHA_BUILD_PRODUCAO', 'FALHA_INSTALACAO_ESTAVEL', 'REPROVADA_TESTE', 'REPROVADA_TESTE_REGRESSIVO', 'REVOGADA'];

    const pendingReleases = allReleases.filter(r => pendingStatuses.includes(r.status)).length;
    const approvedReleases = allReleases.filter(r => approvedStatuses.includes(r.status)).length;
    const availableReleases = allReleases.filter(r => availableStatuses.includes(r.status)).length;
    const failedReleases = allReleases.filter(r => failedStatuses.includes(r.status)).length;

    const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: totalReleases > 0 ? Math.round((count / totalReleases) * 100) : 0
    })).sort((a, b) => b.count - a.count);

    return {
      totalReleases,
      pendingReleases,
      approvedReleases,
      availableReleases,
      failedReleases,
      statusDistribution
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

  navigateToCreateRelease() {
    this.router.navigate(['/releases']);
  }

  navigateToClients() {
    this.router.navigate(['/clients']);
  }

  navigateToVersions() {
    this.router.navigate(['/available-versions']);
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

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}