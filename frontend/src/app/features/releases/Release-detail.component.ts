import { Component, inject, signal, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Release, ReleaseService, UpdateReleaseNotesRequest, UpdatePrerequisitesRequest } from '../../core/services/release.service';

@Component({
  selector: 'app-release-detail',
  template: `
    <div class="release-detail-container">
      @if (loading()) {
        <div class="loading">
          <p>Carregando detalhes da release...</p>
        </div>
      } @else if (error()) {
        <div class="error-card">
          <p>{{ error() }}</p>
          <button (click)="loadRelease()" class="btn btn-primary">Tentar Novamente</button>
        </div>
      } @else if (release()) {
        <div class="release-header">
          <button (click)="goBack()" class="btn btn-secondary">← Voltar</button>
          <h1>Release {{ release()!.version }}</h1>
          <span class="status-badge" [class]="getStatusClass(release()!.status)">
            {{ release()!.statusDisplayName }}
          </span>
        </div>

        <div class="release-content">
          <div class="release-info-section">
            <h2>Informações Gerais</h2>
            <div class="info-grid">
              <div class="info-item">
                <label>Versão:</label>
                <span>{{ release()!.version }}</span>
              </div>
              <div class="info-item">
                <label>Status:</label>
                <span>{{ release()!.statusDisplayName }}</span>
              </div>
              <div class="info-item">
                <label>Criado em:</label>
                <span>{{ formatDate(release()!.createdAt) }}</span>
              </div>
              <div class="info-item">
                <label>Atualizado em:</label>
                <span>{{ formatDate(release()!.updatedAt) }}</span>
              </div>
            </div>
          </div>

          <div class="release-notes-section">
            <div class="section-header">
              <h2>Release Notes</h2>
              <button 
                (click)="toggleEditReleaseNotes()" 
                class="btn btn-outline"
                [class.active]="editingReleaseNotes()">
                {{ editingReleaseNotes() ? 'Cancelar' : 'Editar' }}
              </button>
            </div>

            @if (editingReleaseNotes()) {
              <form [formGroup]="releaseNotesForm" (ngSubmit)="saveReleaseNotes()">
                <textarea 
                  formControlName="releaseNotes"
                  class="form-control textarea"
                  rows="8"
                  placeholder="Digite as release notes..."></textarea>
                <div class="form-actions">
                  <button type="submit" class="btn btn-primary" [disabled]="savingReleaseNotes()">
                    {{ savingReleaseNotes() ? 'Salvando...' : 'Salvar' }}
                  </button>
                  <button type="button" (click)="toggleEditReleaseNotes()" class="btn btn-secondary">
                    Cancelar
                  </button>
                </div>
              </form>
            } @else {
              <div class="content-display">
                @if (release()!.releaseNotes) {
                  <pre class="release-notes-content">{{ release()!.releaseNotes }}</pre>
                } @else {
                  <p class="empty-content">Nenhuma release note adicionada</p>
                }
              </div>
            }
          </div>

          <div class="prerequisites-section">
            <div class="section-header">
              <h2>Pré-requisitos</h2>
              <button 
                (click)="toggleEditPrerequisites()" 
                class="btn btn-outline"
                [class.active]="editingPrerequisites()">
                {{ editingPrerequisites() ? 'Cancelar' : 'Editar' }}
              </button>
            </div>

            @if (editingPrerequisites()) {
              <form [formGroup]="prerequisitesForm" (ngSubmit)="savePrerequisites()">
                <textarea 
                  formControlName="prerequisites"
                  class="form-control textarea"
                  rows="6"
                  placeholder="Digite os pré-requisitos..."></textarea>
                <div class="form-actions">
                  <button type="submit" class="btn btn-primary" [disabled]="savingPrerequisites()">
                    {{ savingPrerequisites() ? 'Salvando...' : 'Salvar' }}
                  </button>
                  <button type="button" (click)="toggleEditPrerequisites()" class="btn btn-secondary">
                    Cancelar
                  </button>
                </div>
              </form>
            } @else {
              <div class="content-display">
                @if (release()!.prerequisites) {
                  <pre class="prerequisites-content">{{ release()!.prerequisites }}</pre>
                } @else {
                  <p class="empty-content">Nenhum pré-requisito adicionado</p>
                }
              </div>
            }
          </div>

          <div class="actions-section">
            <button (click)="viewHistory()" class="btn btn-primary">
              Ver Histórico de Mudanças
            </button>
            @if (release()!.downloadUrl) {
              <a [href]="release()!.downloadUrl" target="_blank" class="btn btn-outline">
                Download da Release
              </a>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .release-detail-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
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

    .release-header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e1e8ed;
    }

    .release-header h1 {
      flex: 1;
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

    .btn-outline {
      background: transparent;
      color: #3498db;
      border: 1px solid #3498db;
    }

    .btn-outline:hover {
      background: #3498db;
      color: white;
    }

    .btn-outline.active {
      background: #e74c3c;
      color: white;
      border-color: #e74c3c;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 16px;
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

    .release-content {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .release-info-section,
    .release-notes-section,
    .prerequisites-section {
      background: white;
      border: 1px solid #e1e8ed;
      border-radius: 8px;
      padding: 24px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .section-header h2 {
      margin: 0;
      color: #2c3e50;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-item label {
      font-weight: 500;
      color: #6c757d;
      font-size: 14px;
    }

    .info-item span {
      color: #2c3e50;
    }

    .form-control {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
      font-family: inherit;
    }

    .textarea {
      resize: vertical;
      min-height: 120px;
    }

    .form-control:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }

    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 16px;
    }

    .content-display {
      min-height: 60px;
    }

    .release-notes-content,
    .prerequisites-content {
      background: #f8f9fa;
      padding: 16px;
      border-radius: 4px;
      border: 1px solid #e9ecef;
      white-space: pre-wrap;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      line-height: 1.5;
      margin: 0;
    }

    .empty-content {
      color: #6c757d;
      font-style: italic;
      margin: 0;
      padding: 16px;
      text-align: center;
      background: #f8f9fa;
      border-radius: 4px;
    }

    .actions-section {
      display: flex;
      gap: 16px;
      justify-content: center;
      padding: 20px;
      border-top: 1px solid #e1e8ed;
    }

    @media (max-width: 768px) {
      .release-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .form-actions {
        flex-direction: column;
      }

      .actions-section {
        flex-direction: column;
      }
    }
  `],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReleaseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private releaseService = inject(ReleaseService);
  private fb = inject(FormBuilder);

  release = signal<Release | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  editingReleaseNotes = signal(false);
  editingPrerequisites = signal(false);
  savingReleaseNotes = signal(false);
  savingPrerequisites = signal(false);

  releaseNotesForm = this.fb.group({
    releaseNotes: ['']
  });

  prerequisitesForm = this.fb.group({
    prerequisites: ['']
  });

  private releaseId = computed(() => this.route.snapshot.paramMap.get('id'));

  ngOnInit() {
    this.loadRelease();
  }

  loadRelease() {
    const id = this.releaseId();
    if (!id) {
      this.error.set('ID da release não encontrado');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.releaseService.getReleaseById(id).subscribe({
      next: (release) => {
        this.release.set(release);
        this.releaseNotesForm.patchValue({ releaseNotes: release.releaseNotes || '' });
        this.prerequisitesForm.patchValue({ prerequisites: release.prerequisites || '' });
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Erro ao carregar release: ' + (error.error?.message || error.message));
        this.loading.set(false);
      }
    });
  }

  toggleEditReleaseNotes() {
    this.editingReleaseNotes.update(editing => !editing);
    if (this.editingReleaseNotes()) {
      const currentRelease = this.release();
      if (currentRelease) {
        this.releaseNotesForm.patchValue({ releaseNotes: currentRelease.releaseNotes || '' });
      }
    }
  }

  toggleEditPrerequisites() {
    this.editingPrerequisites.update(editing => !editing);
    if (this.editingPrerequisites()) {
      const currentRelease = this.release();
      if (currentRelease) {
        this.prerequisitesForm.patchValue({ prerequisites: currentRelease.prerequisites || '' });
      }
    }
  }

  saveReleaseNotes() {
    const currentRelease = this.release();
    if (!currentRelease) return;

    this.savingReleaseNotes.set(true);
    const request: UpdateReleaseNotesRequest = {
      releaseNotes: this.releaseNotesForm.value.releaseNotes || ''
    };

    this.releaseService.updateReleaseNotes(currentRelease.id, request).subscribe({
      next: (updatedRelease) => {
        this.release.set(updatedRelease);
        this.editingReleaseNotes.set(false);
        this.savingReleaseNotes.set(false);
      },
      error: (error) => {
        this.error.set('Erro ao salvar release notes: ' + (error.error?.message || error.message));
        this.savingReleaseNotes.set(false);
      }
    });
  }

  savePrerequisites() {
    const currentRelease = this.release();
    if (!currentRelease) return;

    this.savingPrerequisites.set(true);
    const request: UpdatePrerequisitesRequest = {
      prerequisites: this.prerequisitesForm.value.prerequisites || ''
    };

    this.releaseService.updatePrerequisites(currentRelease.id, request).subscribe({
      next: (updatedRelease) => {
        this.release.set(updatedRelease);
        this.editingPrerequisites.set(false);
        this.savingPrerequisites.set(false);
      },
      error: (error) => {
        this.error.set('Erro ao salvar pré-requisitos: ' + (error.error?.message || error.message));
        this.savingPrerequisites.set(false);
      }
    });
  }

  viewHistory() {
    const currentRelease = this.release();
    if (currentRelease) {
      this.router.navigate(['/releases', currentRelease.id, 'history']);
    }
  }

  goBack() {
    this.router.navigate(['/releases']);
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
    return new Date(dateString).toLocaleString('pt-BR');
  }
}