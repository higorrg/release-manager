import { Component, inject, signal, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Release, ReleaseService, ReleaseStatus, CreateReleaseRequest, UpdateStatusRequest } from '../../core/services/release.service';

@Component({
  selector: 'app-release-list',
  standalone: true,
  template: `
    <div class="release-list-container">
      <div class="header">
        <h2>Gerenciamento de Releases</h2>
        <button 
          (click)="toggleCreateForm()" 
          class="btn btn-primary"
          [class.active]="showCreateForm()">
          {{ showCreateForm() ? 'Cancelar' : 'Nova Release' }}
        </button>
      </div>

      @if (showCreateForm()) {
        <div class="create-form-card">
          <h3>Criar Nova Release</h3>
          <form [formGroup]="createForm" (ngSubmit)="createRelease()">
            <div class="form-group">
              <label for="productName">Nome do Produto</label>
              <input 
                id="productName"
                type="text" 
                formControlName="productName"
                class="form-control"
                placeholder="Ex: Plataforma Shift">
              @if (createForm.get('productName')?.invalid && createForm.get('productName')?.touched) {
                <div class="error-message">Nome do produto é obrigatório</div>
              }
            </div>

            <div class="form-group">
              <label for="version">Versão</label>
              <input 
                id="version"
                type="text" 
                formControlName="version"
                class="form-control"
                placeholder="Ex: 1.2.3">
              @if (createForm.get('version')?.invalid && createForm.get('version')?.touched) {
                <div class="error-message">Versão é obrigatória (formato: x.y.z)</div>
              }
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" [disabled]="createForm.invalid || creating()">
                {{ creating() ? 'Criando...' : 'Criar Release' }}
              </button>
              <button type="button" (click)="toggleCreateForm()" class="btn btn-secondary">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      }

      @if (loading()) {
        <div class="loading">
          <p>Carregando releases...</p>
        </div>
      } @else if (error()) {
        <div class="error-card">
          <p>{{ error() }}</p>
          <button (click)="loadReleases()" class="btn btn-primary">Tentar Novamente</button>
        </div>
      } @else {
        <div class="releases-grid">
          @for (release of releases(); track release.id) {
            <div class="release-card">
              <div class="release-header">
                <h3>{{ release.version }}</h3>
                <span class="status-badge" [class]="getStatusClass(release.status)">
                  {{ release.statusDisplayName }}
                </span>
              </div>

              <div class="release-info">
                <p><strong>Criado em:</strong> {{ formatDate(release.createdAt) }}</p>
                <p><strong>Atualizado em:</strong> {{ formatDate(release.updatedAt) }}</p>
              </div>

              <div class="status-update">
                <label>Alterar Status:</label>
                <select 
                  [value]="release.status" 
                  (change)="updateStatus(release, $event)"
                  class="status-select">
                  @for (status of availableStatuses(); track status) {
                    <option [value]="status">{{ getStatusDisplayName(status) }}</option>
                  }
                </select>
              </div>

              <div class="release-actions">
                <button (click)="viewDetails(release.id)" class="btn btn-outline">
                  Ver Detalhes
                </button>
                <button (click)="viewHistory(release.id)" class="btn btn-outline">
                  Histórico
                </button>
              </div>
            </div>
          }

          @if (releases().length === 0) {
            <div class="empty-state">
              <p>Nenhuma release encontrada</p>
              <p>Crie sua primeira release usando o botão "Nova Release"</p>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .release-list-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .header h2 {
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

    .btn-primary.active {
      background: #e74c3c;
    }

    .btn-secondary {
      background: #95a5a6;
      color: white;
    }

    .btn-secondary:hover {
      background: #7f8c8d;
    }

    .btn-outline {
      background: transparent;
      color: #3498db;
      border: 1px solid #3498db;
    }

    .btn-outline:hover {
      background: #3498db;
      color: white;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .create-form-card {
      background: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 30px;
      border: 1px solid #e1e8ed;
    }

    .create-form-card h3 {
      margin: 0 0 20px 0;
      color: #2c3e50;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-group label {
      display: block;
      margin-bottom: 4px;
      font-weight: 500;
      color: #2c3e50;
    }

    .form-control {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }

    .form-control:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }

    .error-message {
      color: #e74c3c;
      font-size: 12px;
      margin-top: 4px;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
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

    .releases-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .release-card {
      background: white;
      border: 1px solid #e1e8ed;
      border-radius: 8px;
      padding: 20px;
      transition: box-shadow 0.3s;
    }

    .release-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .release-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .release-header h3 {
      margin: 0;
      color: #2c3e50;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .status-mr-aprovado { background: #d1ecf1; color: #0c5460; }
    .status-para-teste { background: #fff3cd; color: #856404; }
    .status-aprovada { background: #d4edda; color: #155724; }
    .status-reprovada { background: #f8d7da; color: #721c24; }
    .status-falha { background: #f8d7da; color: #721c24; }
    .status-controlada { background: #e2e3e5; color: #383d41; }
    .status-disponivel { background: #d4edda; color: #155724; }
    .status-revogada { background: #f8d7da; color: #721c24; }

    .release-info {
      margin-bottom: 16px;
    }

    .release-info p {
      margin: 4px 0;
      font-size: 14px;
      color: #6c757d;
    }

    .status-update {
      margin-bottom: 16px;
    }

    .status-update label {
      display: block;
      margin-bottom: 4px;
      font-weight: 500;
      color: #2c3e50;
      font-size: 14px;
    }

    .status-select {
      width: 100%;
      padding: 6px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 13px;
    }

    .release-actions {
      display: flex;
      gap: 8px;
    }

    .release-actions .btn {
      flex: 1;
      text-align: center;
      font-size: 12px;
      padding: 6px 8px;
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 60px 20px;
      color: #7f8c8d;
    }

    .empty-state p {
      margin: 8px 0;
    }
  `],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReleaseListComponent {
  private releaseService = inject(ReleaseService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  releases = signal<Release[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  creating = signal(false);
  showCreateForm = signal(false);

  createForm = this.fb.group({
    productName: ['', [Validators.required]],
    version: ['', [Validators.required, Validators.pattern(/^\d+\.\d+\.\d+$/)]]
  });

  availableStatuses = computed(() => this.releaseService.getAvailableStatuses());

  ngOnInit() {
    this.loadReleases();
  }

  loadReleases() {
    this.loading.set(true);
    this.error.set(null);
    
    this.releaseService.getAllReleases().subscribe({
      next: (releases) => {
        this.releases.set(releases);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading releases:', error);
        this.error.set('Erro ao carregar releases. Tente novamente.');
        this.loading.set(false);
      }
    });
  }

  toggleCreateForm() {
    this.showCreateForm.update(show => !show);
    if (!this.showCreateForm()) {
      this.createForm.reset();
    }
  }

  createRelease() {
    if (this.createForm.valid) {
      this.creating.set(true);
      const request: CreateReleaseRequest = {
        productName: this.createForm.value.productName!,
        version: this.createForm.value.version!
      };

      this.releaseService.createReleaseFromPipeline(request).subscribe({
        next: (release) => {
          this.createForm.reset();
          this.showCreateForm.set(false);
          this.creating.set(false);
          // Reload the list to ensure we have fresh data
          this.loadReleases();
        },
        error: (error) => {
          this.error.set('Erro ao criar release: ' + (error.error?.message || error.message));
          this.creating.set(false);
        }
      });
    }
  }

  updateStatus(release: Release, event: Event) {
    const newStatus = (event.target as HTMLSelectElement).value as ReleaseStatus;
    if (newStatus !== release.status) {
      const request: UpdateStatusRequest = { status: newStatus };
      
      this.releaseService.updateReleaseStatus(release.id, newStatus).subscribe({
        next: (updatedRelease) => {
          this.releases.update(releases => 
            releases.map(r => r.id === release.id ? updatedRelease : r)
          );
        },
        error: (error) => {
          this.error.set('Erro ao atualizar status: ' + (error.error?.message || error.message));
          // Reset select to original value
          (event.target as HTMLSelectElement).value = release.status;
        }
      });
    }
  }

  viewDetails(releaseId: string) {
    this.router.navigate(['/releases', releaseId]);
  }

  viewHistory(releaseId: string) {
    this.router.navigate(['/releases', releaseId, 'history']);
  }

  getStatusDisplayName(status: ReleaseStatus): string {
    return status; // Since our status is already the display name
  }

  getStatusClass(status: ReleaseStatus): string {
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
    return new Date(dateString).toLocaleString('pt-BR');
  }
}