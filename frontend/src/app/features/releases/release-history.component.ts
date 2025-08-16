import { Component, inject, signal, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ReleaseStatusHistory, ReleaseService } from '../../core/services/release.service';

@Component({
  selector: 'app-release-history',
  standalone: true,
  template: `
    <div class="history-container">
      <div class="header">
        <button (click)="goBack()" class="btn btn-secondary">← Voltar</button>
        <h1>Histórico de Mudanças</h1>
      </div>

      @if (loading()) {
        <div class="loading">
          <p>Carregando histórico...</p>
        </div>
      } @else if (error()) {
        <div class="error-card">
          <p>{{ error() }}</p>
          <button (click)="loadHistory()" class="btn btn-primary">Tentar Novamente</button>
        </div>
      } @else {
        <div class="timeline">
          @for (item of history(); track item.id) {
            <div class="timeline-item">
              <div class="timeline-marker" [class]="getStatusTypeClass(item.newStatus)"></div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <div class="status-change">
                    @if (item.previousStatus) {
                      <span class="status-badge previous" [class]="getStatusClass(item.previousStatus)">
                        {{ item.previousStatusDisplayName }}
                      </span>
                      <span class="arrow">→</span>
                    }
                    <span class="status-badge current" [class]="getStatusClass(item.newStatus)">
                      {{ item.newStatusDisplayName }}
                    </span>
                  </div>
                  <div class="timeline-meta">
                    <span class="changed-by">{{ item.changedBy }}</span>
                    <span class="changed-at">{{ formatDate(item.changedAt) }}</span>
                  </div>
                </div>
                @if (item.comments) {
                  <div class="timeline-comments">
                    <strong>Comentários:</strong>
                    <p>{{ item.comments }}</p>
                  </div>
                }
              </div>
            </div>
          }

          @if (history().length === 0) {
            <div class="empty-state">
              <p>Nenhum histórico de mudanças encontrado</p>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .history-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e1e8ed;
    }

    .header h1 {
      margin: 0;
      color: #2c3e50;
    }

    .btn {
      padding: 10px 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s;
      text-decoration: none;
      display: inline-block;
    }

    .btn-primary {
      background: #3498db;
      color: white;
    }

    .btn-primary:hover {
      background: #2980b9;
    }

    .btn-secondary {
      background: #95a5a6;
      color: white;
    }

    .btn-secondary:hover {
      background: #7f8c8d;
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: #7f8c8d;
    }

    .error-card {
      background: #fff5f5;
      border: 1px solid #fed7d7;
      color: #e53e3e;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }

    .timeline {
      position: relative;
      padding-left: 40px;
    }

    .timeline::before {
      content: '';
      position: absolute;
      left: 15px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #e1e8ed;
    }

    .timeline-item {
      position: relative;
      margin-bottom: 30px;
    }

    .timeline-marker {
      position: absolute;
      left: -32px;
      top: 8px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 0 2px #e1e8ed;
    }

    .timeline-marker.success {
      background: #27ae60;
      box-shadow: 0 0 0 2px #27ae60;
    }

    .timeline-marker.warning {
      background: #f39c12;
      box-shadow: 0 0 0 2px #f39c12;
    }

    .timeline-marker.error {
      background: #e74c3c;
      box-shadow: 0 0 0 2px #e74c3c;
    }

    .timeline-marker.info {
      background: #3498db;
      box-shadow: 0 0 0 2px #3498db;
    }

    .timeline-marker.neutral {
      background: #95a5a6;
      box-shadow: 0 0 0 2px #95a5a6;
    }

    .timeline-content {
      background: white;
      border: 1px solid #e1e8ed;
      border-radius: 8px;
      padding: 20px;
    }

    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .status-change {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .status-badge.previous {
      opacity: 0.7;
    }

    .arrow {
      font-size: 16px;
      color: #6c757d;
    }

    .status-mr-aprovado { background: #d1ecf1; color: #0c5460; }
    .status-para-teste { background: #fff3cd; color: #856404; }
    .status-aprovada { background: #d4edda; color: #155724; }
    .status-reprovada { background: #f8d7da; color: #721c24; }
    .status-falha { background: #f8d7da; color: #721c24; }
    .status-controlada { background: #e2e3e5; color: #383d41; }
    .status-disponivel { background: #d4edda; color: #155724; }
    .status-revogada { background: #f8d7da; color: #721c24; }

    .timeline-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
      font-size: 12px;
      color: #6c757d;
    }

    .changed-by {
      font-weight: 500;
    }

    .timeline-comments {
      background: #f8f9fa;
      padding: 12px;
      border-radius: 4px;
      border-left: 3px solid #3498db;
    }

    .timeline-comments strong {
      color: #2c3e50;
      font-size: 14px;
    }

    .timeline-comments p {
      margin: 4px 0 0 0;
      color: #495057;
      line-height: 1.4;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #7f8c8d;
    }

    @media (max-width: 768px) {
      .timeline {
        padding-left: 30px;
      }

      .timeline-marker {
        left: -27px;
        width: 12px;
        height: 12px;
      }

      .timeline-header {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }

      .timeline-meta {
        align-items: flex-start;
      }

      .status-change {
        flex-wrap: wrap;
      }
    }
  `],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReleaseHistoryComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private releaseService = inject(ReleaseService);

  history = signal<ReleaseStatusHistory[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  private releaseId = computed(() => this.route.snapshot.paramMap.get('id'));

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    const id = this.releaseId();
    if (!id) {
      this.error.set('ID da release não encontrado');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.releaseService.getReleaseStatusHistory(id).subscribe({
      next: (history) => {
        this.history.set(history);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Erro ao carregar histórico: ' + (error.error?.message || error.message));
        this.loading.set(false);
      }
    });
  }

  goBack() {
    // Use the browser's back functionality to return to the previous page
    // This will automatically go back to either the release list or release details
    // depending on where the user came from
    this.location.back();
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

  getStatusTypeClass(status: string): string {
    const successStatuses = ['APROVADA_TESTE', 'APROVADA_TESTE_REGRESSIVO', 'DISPONIVEL'];
    const errorStatuses = ['REPROVADA_TESTE', 'REPROVADA_TESTE_REGRESSIVO', 'FALHA_BUILD_TESTE', 'FALHA_BUILD_PRODUCAO', 'FALHA_INSTALACAO_ESTAVEL', 'REVOGADA'];
    const warningStatuses = ['PARA_TESTE_SISTEMA', 'PARA_TESTE_REGRESSIVO'];
    const infoStatuses = ['MR_APROVADO', 'CONTROLADA'];

    if (successStatuses.includes(status)) return 'success';
    if (errorStatuses.includes(status)) return 'error';
    if (warningStatuses.includes(status)) return 'warning';
    if (infoStatuses.includes(status)) return 'info';
    return 'neutral';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('pt-BR');
  }
}