import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VersionService } from '../../core/services/version.service';
import { ClientService, Environment } from '../../core/services/client.service';
import { AvailableVersion } from '../../core/models/available-version.model';

@Component({
  selector: 'app-available-versions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="available-versions-container">
      <div class="header">
        <h1>Versões Disponíveis</h1>
        <p>Consulte as versões disponíveis para atualização da plataforma por cliente e ambiente</p>
      </div>

      <div class="search-form">
        <form [formGroup]="searchForm" (ngSubmit)="searchVersions()">
          <div class="form-row">
            <div class="form-group">
              <label for="clientCode">Código do Cliente:</label>
              <input 
                id="clientCode" 
                type="text" 
                formControlName="clientCode" 
                class="form-control"
                placeholder="Ex: CLI001">
            </div>
            <div class="form-group">
              <label for="environment">Ambiente:</label>
              <select id="environment" formControlName="environment" class="form-control">
                <option value="">Selecione um ambiente</option>
                @for (env of environments(); track env.id) {
                  <option [value]="env.name">{{ env.name }}</option>
                }
              </select>
            </div>
            <button 
              type="submit" 
              class="btn btn-primary"
              [disabled]="!searchForm.valid || loading()">
              {{ loading() ? 'Buscando...' : 'Buscar Versões' }}
            </button>
          </div>
        </form>
      </div>

      @if (loading()) {
        <div class="loading">Carregando versões disponíveis...</div>
      } @else if (error()) {
        <div class="error">
          <p>{{ error() }}</p>
          <button class="btn btn-primary" (click)="searchVersions()">Tentar Novamente</button>
        </div>
      } @else if (searchPerformed() && versions().length === 0) {
        <div class="empty-state">
          <p>Nenhuma versão disponível encontrada para este cliente e ambiente.</p>
          <p class="hint">Verifique se o cliente está associado a releases no status "Controlada" ou "Disponível" para o ambiente selecionado.</p>
        </div>
      } @else if (versions().length > 0) {
        <div class="versions-container">
          <h2>Versões Disponíveis para {{ lastSearch().clientCode }} - {{ lastSearch().environment }}</h2>
          <div class="versions-grid">
            @for (version of versions(); track version.releaseId) {
              <div class="version-card">
                <div class="version-header">
                  <h3>{{ version.productName }}</h3>
                  <span class="version-number">v{{ version.version }}</span>
                </div>

                <div class="version-info">
                  <div class="info-section">
                    <h4>Release Notes</h4>
                    <p [class.empty]="!version.releaseNotes">
                      {{ version.releaseNotes || 'Nenhuma release note disponível' }}
                    </p>
                  </div>

                  <div class="info-section">
                    <h4>Pré-requisitos</h4>
                    <p [class.empty]="!version.prerequisites">
                      {{ version.prerequisites || 'Nenhum pré-requisito informado' }}
                    </p>
                  </div>

                  <div class="info-section">
                    <h4>Data de Criação</h4>
                    <p>{{ formatDate(version.createdAt) }}</p>
                  </div>

                  <div class="info-section">
                    <h4>Download</h4>
                    <a 
                      [href]="version.downloadUrl || '#'" 
                      class="download-link"
                      [class.disabled]="!version.downloadUrl"
                      [attr.aria-disabled]="!version.downloadUrl"
                      target="_blank"
                      (click)="!version.downloadUrl && $event.preventDefault()">
                      {{ version.downloadUrl ? 'Baixar Pacote' : 'Pacote não disponível' }}
                    </a>
                  </div>
                </div>

                <div class="version-actions">
                  <button 
                    class="btn btn-secondary"
                    (click)="viewReleaseDetails(version.releaseId)">
                    Ver Detalhes da Release
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .available-versions-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 30px;
      text-align: center;
    }

    .header h1 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .header p {
      color: #666;
      font-size: 16px;
    }

    .search-form {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 20px;
      align-items: end;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      font-weight: 500;
      color: #495057;
      margin-bottom: 5px;
    }

    .form-control {
      padding: 10px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-control:focus {
      outline: none;
      border-color: #80bdff;
      box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s;
      text-decoration: none;
      display: inline-block;
      text-align: center;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #0056b3;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #5a6268;
    }

    .loading, .error, .empty-state {
      text-align: center;
      padding: 40px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .error {
      color: #dc3545;
    }

    .error p {
      margin-bottom: 20px;
    }

    .empty-state .hint {
      color: #6c757d;
      font-size: 14px;
      margin-top: 10px;
    }

    .versions-container h2 {
      margin-bottom: 20px;
      color: #333;
    }

    .versions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
    }

    .version-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .version-header {
      background: #f8f9fa;
      padding: 20px;
      border-bottom: 1px solid #dee2e6;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .version-header h3 {
      margin: 0;
      color: #333;
    }

    .version-number {
      background: #007bff;
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-weight: 500;
      font-size: 14px;
    }

    .version-info {
      padding: 20px;
    }

    .info-section {
      margin-bottom: 20px;
    }

    .info-section:last-child {
      margin-bottom: 0;
    }

    .info-section h4 {
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 600;
      color: #495057;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-section p {
      margin: 0;
      color: #333;
      line-height: 1.5;
    }

    .info-section p.empty {
      color: #6c757d;
      font-style: italic;
    }

    .download-link {
      color: #007bff;
      text-decoration: none;
    }

    .download-link:hover {
      text-decoration: underline;
    }

    .download-link.disabled {
      color: #6c757d;
      cursor: not-allowed;
      opacity: 0.6;
      pointer-events: none;
    }

    .download-link.disabled:hover {
      text-decoration: none;
    }

    .version-actions {
      padding: 20px;
      border-top: 1px solid #dee2e6;
      background: #f8f9fa;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
        gap: 15px;
      }

      .versions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AvailableVersionsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private versionService = inject(VersionService);
  private clientService = inject(ClientService);
  private router = inject(Router);

  // State
  versions = signal<AvailableVersion[]>([]);
  environments = signal<Environment[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  searchPerformed = signal(false);
  lastSearch = signal<{clientCode: string, environment: string}>({clientCode: '', environment: ''});

  // Form
  searchForm = this.fb.group({
    clientCode: ['', Validators.required],
    environment: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadEnvironments();
  }

  loadEnvironments(): void {
    this.clientService.getAllEnvironments().subscribe({
      next: (environments) => {
        this.environments.set(environments);
      },
      error: (err) => {
        console.error('Erro ao carregar ambientes:', err);
      }
    });
  }

  searchVersions(): void {
    if (!this.searchForm.valid) return;

    const { clientCode, environment } = this.searchForm.value;
    
    this.loading.set(true);
    this.error.set(null);
    this.lastSearch.set({clientCode: clientCode!, environment: environment!});

    this.versionService.getAvailableVersions(clientCode!, environment!).subscribe({
      next: (versions) => {
        this.versions.set(versions);
        this.searchPerformed.set(true);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao buscar versões disponíveis: ' + err.message);
        this.loading.set(false);
      }
    });
  }

  viewReleaseDetails(releaseId: string): void {
    this.router.navigate(['/releases', releaseId]);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('pt-BR');
  }
}