import { Component, inject, signal, computed, effect, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReleaseService } from '../../core/services/release.service';
import { Release, ReleaseStatus } from '../../core/services/release.service';
import { ClientService, ControlledClientDetail, Client, Environment } from '../../core/services/client.service';
import { ConfirmationService } from '../../shared/services/confirmation.service';

@Component({
  selector: 'app-release-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="release-detail-container">
      @if (loading()) {
        <div class="loading">Carregando...</div>
      } @else if (error()) {
        <div class="error">{{ error() }}</div>
      } @else if (release()) {
        <div class="release-header">
          <h1>{{ release()?.product }} - v{{ release()?.version }}</h1>
          <button class="btn-back" (click)="navigateBack()">Voltar</button>
        </div>

        <div class="release-content">
          <section class="release-info">
            <h2>Informações da Release</h2>
            <div class="info-grid">
              <div class="info-item">
                <label>Produto:</label>
                <span>{{ release()?.product }}</span>
              </div>
              <div class="info-item">
                <label>Versão:</label>
                <span>{{ release()?.version }}</span>
              </div>
              <div class="info-item">
                <label>Status Atual:</label>
                <span [class.status]="true" [class]="'status-' + statusClass()">
                  {{ release()?.statusDisplayName }}
                </span>
              </div>
              <div class="info-item">
                <label>Data de Criação:</label>
                <span>{{ formatDate(release()?.createdAt) }}</span>
              </div>
              <div class="info-item">
                <label>Última Atualização:</label>
                <span>{{ formatDate(release()?.updatedAt) }}</span>
              </div>
            </div>
          </section>

          <section class="status-update">
            <h2>Alterar Status</h2>
            <form [formGroup]="statusForm" (ngSubmit)="updateStatus()">
              <div class="form-group">
                <label for="status">Novo Status:</label>
                <select id="status" formControlName="status" class="form-control">
                  <option value="">Selecione um status</option>
                  @for (status of availableStatuses; track status) {
                    <option [value]="status">{{ status }}</option>
                  }
                </select>
              </div>
              <div class="form-group">
                <label for="notes">Observações:</label>
                <textarea 
                  id="notes" 
                  formControlName="notes" 
                  class="form-control"
                  rows="3"
                  placeholder="Adicione observações sobre a mudança de status (opcional)">
                </textarea>
              </div>
              <button 
                type="submit" 
                class="btn btn-primary" 
                [disabled]="!statusForm.valid || updating()">
                {{ updating() ? 'Atualizando...' : 'Atualizar Status' }}
              </button>
            </form>
          </section>

          <section class="release-notes">
            <h2>Release Notes</h2>
            <form [formGroup]="releaseNotesForm" (ngSubmit)="updateReleaseNotes()">
              <div class="form-group">
                <textarea 
                  formControlName="releaseNotes" 
                  class="form-control"
                  rows="6"
                  placeholder="Digite as release notes...">
                </textarea>
              </div>
              <button 
                type="submit" 
                class="btn btn-secondary"
                [disabled]="!releaseNotesForm.dirty || updating()">
                Salvar Release Notes
              </button>
            </form>
          </section>

          <section class="prerequisites">
            <h2>Pré-requisitos</h2>
            <form [formGroup]="prerequisitesForm" (ngSubmit)="updatePrerequisites()">
              <div class="form-group">
                <textarea 
                  formControlName="prerequisites" 
                  class="form-control"
                  rows="6"
                  placeholder="Digite os pré-requisitos...">
                </textarea>
              </div>
              <button 
                type="submit" 
                class="btn btn-secondary"
                [disabled]="!prerequisitesForm.dirty || updating()">
                Salvar Pré-requisitos
              </button>
            </form>
          </section>

          <section class="package-info">
            <h2>Informações de Pacote</h2>
            <form [formGroup]="packageInfoForm" (ngSubmit)="updatePackageInfo()">
              <div class="form-group">
                <label for="downloadUrl">URL de Download:</label>
                <input 
                  id="downloadUrl"
                  type="url" 
                  formControlName="downloadUrl" 
                  class="form-control"
                  placeholder="https://exemplo.com/download/release.zip">
              </div>
              <div class="form-group">
                <label for="packagePath">Caminho do Pacote:</label>
                <input 
                  id="packagePath"
                  type="text" 
                  formControlName="packagePath" 
                  class="form-control"
                  placeholder="/path/to/package/release.zip">
              </div>
              <div class="download-actions">
                <button 
                  type="submit" 
                  class="btn btn-secondary"
                  [disabled]="!packageInfoForm.dirty || updating()">
                  Salvar Informações
                </button>
                @if (release()?.downloadUrl) {
                  <a 
                    [href]="release()?.downloadUrl" 
                    target="_blank"
                    class="btn btn-download">
                    Download do Pacote
                  </a>
                }
              </div>
            </form>
          </section>

          <section class="controlled-clients">
            <h2>Clientes em Controlado</h2>
            <div class="clients-header">
              <button class="btn btn-add" (click)="showAddClient = !showAddClient">
                Adicionar Cliente
              </button>
            </div>
            
            @if (showAddClient) {
              <form [formGroup]="clientForm" (ngSubmit)="addClient()" class="add-client-form">
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
                      <option value="">Selecione</option>
                      @for (env of environments(); track env.id) {
                        <option [value]="env.name">{{ env.name }}</option>
                      }
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    [disabled]="!clientForm.valid || updating()">
                    Adicionar
                  </button>
                </div>
              </form>
            }

            <div class="clients-list">
              @if (controlledClients().length > 0) {
                <table class="clients-table">
                  <thead>
                    <tr>
                      <th>Código do Cliente</th>
                      <th>Nome do Cliente</th>
                      <th>Ambiente</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (controlledClient of controlledClients(); track controlledClient.id) {
                      <tr>
                        <td>{{ controlledClient.clientCode }}</td>
                        <td>{{ controlledClient.clientName }}</td>
                        <td>{{ controlledClient.environmentName }}</td>
                        <td>
                          <button 
                            class="btn btn-danger btn-sm"
                            (click)="removeClient(controlledClient.clientId, controlledClient.environmentId)">
                            Remover
                          </button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              } @else {
                <p class="no-clients">Nenhum cliente em controlado para esta release.</p>
              }
            </div>
          </section>
        </div>
      }
    </div>
  `,
  styles: [`
    .release-detail-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .loading, .error {
      text-align: center;
      padding: 40px;
      font-size: 18px;
    }

    .error {
      color: #dc3545;
    }

    .release-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e0e0e0;
    }

    .release-header h1 {
      margin: 0;
      color: #333;
    }

    .btn-back {
      padding: 8px 16px;
      background: #6c757d;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn-back:hover {
      background: #5a6268;
    }

    .release-content {
      display: grid;
      gap: 30px;
    }

    section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    section h2 {
      margin-top: 0;
      margin-bottom: 20px;
      color: #495057;
      font-size: 20px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
    }

    .info-item label {
      font-weight: 600;
      color: #6c757d;
      margin-bottom: 5px;
    }

    .info-item span {
      color: #333;
    }

    .status {
      padding: 4px 12px;
      border-radius: 4px;
      font-weight: 500;
      display: inline-block;
    }

    .status-approved {
      background: #d4edda;
      color: #155724;
    }

    .status-pending {
      background: #fff3cd;
      color: #856404;
    }

    .status-failed {
      background: #f8d7da;
      color: #721c24;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #495057;
    }

    .form-control {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-control:focus {
      outline: none;
      border-color: #80bdff;
      box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
    }

    textarea.form-control {
      resize: vertical;
      font-family: inherit;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s;
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

    .btn-secondary:hover:not(:disabled) {
      background: #5a6268;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background: #c82333;
    }

    .btn-add {
      background: #28a745;
      color: white;
    }

    .btn-add:hover {
      background: #218838;
    }

    .btn-download {
      background: #17a2b8;
      color: white;
      text-decoration: none;
      margin-left: 10px;
    }

    .btn-download:hover {
      background: #138496;
      text-decoration: none;
      color: white;
    }

    .download-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .btn-sm {
      padding: 4px 8px;
      font-size: 12px;
    }

    .clients-header {
      margin-bottom: 20px;
    }

    .add-client-form {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 15px;
      align-items: end;
    }

    .clients-table {
      width: 100%;
      border-collapse: collapse;
    }

    .clients-table th,
    .clients-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #dee2e6;
    }

    .clients-table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #495057;
    }

    .clients-table tr:hover {
      background: #f8f9fa;
    }

    .no-clients {
      color: #6c757d;
      text-align: center;
      padding: 20px;
    }
  `]
})
export class ReleaseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private releaseService = inject(ReleaseService);
  private clientService = inject(ClientService);
  private confirmationService = inject(ConfirmationService);

  release = signal<Release | null>(null);
  controlledClients = signal<ControlledClientDetail[]>([]);
  clients = signal<Client[]>([]);
  environments = signal<Environment[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  updating = signal(false);
  showAddClient = false;

  availableStatuses: ReleaseStatus[] = [
    'MR Aprovado',
    'Falha no Build para Teste',
    'Para Teste de Sistema',
    'Reprovada no teste',
    'Aprovada no teste',
    'Falha no Build para Produção',
    'Para Teste Regressivo',
    'Falha na instalação da Estável',
    'Interno',
    'Revogada',
    'Reprovada no teste regressivo',
    'Aprovada no teste regressivo',
    'Controlada',
    'Disponível'
  ];

  statusForm = this.fb.group({
    status: ['', Validators.required],
    notes: ['']
  });

  releaseNotesForm = this.fb.group({
    releaseNotes: ['']
  });

  prerequisitesForm = this.fb.group({
    prerequisites: ['']
  });

  clientForm = this.fb.group({
    clientCode: ['', Validators.required],
    environment: ['', Validators.required]
  });

  packageInfoForm = this.fb.group({
    downloadUrl: [''],
    packagePath: ['']
  });

  statusClass = computed(() => {
    const status = this.release()?.statusDisplayName;
    if (!status) return '';
    
    if (status.includes('Aprovad')) return 'approved';
    if (status.includes('Falha') || status.includes('Reprovad')) return 'failed';
    if (status.includes('Disponível')) return 'available';
    return 'pending';
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        console.log('Loading release with ID:', id);
        this.loadRelease(id);
      }
    });
  }

  loadRelease(id: string): void {
    this.loading.set(true);
    this.error.set(null);
    
    // Load release
    this.releaseService.getRelease(id).subscribe({
      next: (release) => {
        this.release.set(release);
        this.releaseNotesForm.patchValue({
          releaseNotes: release.releaseNotes || ''
        });
        this.prerequisitesForm.patchValue({
          prerequisites: release.prerequisites || ''
        });
        this.packageInfoForm.patchValue({
          downloadUrl: release.downloadUrl || '',
          packagePath: release.packagePath || ''
        });
        this.loadControlledClients(id);
        this.loadEnvironments();
      },
      error: (err) => {
        this.error.set('Erro ao carregar release: ' + err.message);
        this.loading.set(false);
      }
    });
  }

  loadControlledClients(releaseId: string): void {
    this.clientService.getControlledClients(releaseId).subscribe({
      next: (controlledClients) => {
        this.controlledClients.set(controlledClients);
      },
      error: (err) => {
        console.error('Erro ao carregar clientes controlados:', err);
      }
    });
  }

  loadEnvironments(): void {
    this.clientService.getAllEnvironments().subscribe({
      next: (environments) => {
        this.environments.set(environments);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar ambientes:', err);
        this.loading.set(false);
      }
    });
  }

  updateStatus(): void {
    if (!this.statusForm.valid || !this.release()) return;
    
    this.updating.set(true);
    const { status, notes } = this.statusForm.value;
    
    this.releaseService.updateReleaseStatus(
      this.release()!.id, 
      status as ReleaseStatus,
      notes || undefined
    ).subscribe({
      next: (updatedRelease) => {
        this.release.set(updatedRelease);
        this.statusForm.reset();
        this.updating.set(false);
      },
      error: (err) => {
        const errorMessage = err.error?.message || err.message || 'Erro desconhecido';
        this.error.set('Erro ao atualizar status: ' + errorMessage);
        this.updating.set(false);
      }
    });
  }

  updateReleaseNotes(): void {
    if (!this.releaseNotesForm.dirty || !this.release()) return;
    
    this.updating.set(true);
    const { releaseNotes } = this.releaseNotesForm.value;
    
    this.releaseService.updateReleaseNotes(
      this.release()!.id,
      releaseNotes || ''
    ).subscribe({
      next: (updatedRelease) => {
        this.release.set(updatedRelease);
        this.releaseNotesForm.markAsPristine();
        this.updating.set(false);
      },
      error: (err) => {
        const errorMessage = err.error?.message || err.message || 'Erro desconhecido';
        this.error.set('Erro ao atualizar release notes: ' + errorMessage);
        this.updating.set(false);
      }
    });
  }

  updatePrerequisites(): void {
    if (!this.prerequisitesForm.dirty || !this.release()) return;
    
    this.updating.set(true);
    const { prerequisites } = this.prerequisitesForm.value;
    
    this.releaseService.updatePrerequisites(
      this.release()!.id,
      prerequisites || ''
    ).subscribe({
      next: (updatedRelease) => {
        this.release.set(updatedRelease);
        this.prerequisitesForm.markAsPristine();
        this.updating.set(false);
      },
      error: (err) => {
        const errorMessage = err.error?.message || err.message || 'Erro desconhecido';
        this.error.set('Erro ao atualizar pré-requisitos: ' + errorMessage);
        this.updating.set(false);
      }
    });
  }

  updatePackageInfo(): void {
    if (!this.packageInfoForm.dirty || !this.release()) return;
    
    this.updating.set(true);
    const { downloadUrl, packagePath } = this.packageInfoForm.value;
    
    this.releaseService.updatePackageInfo(
      this.release()!.id,
      downloadUrl || undefined,
      packagePath || undefined
    ).subscribe({
      next: (updatedRelease) => {
        this.release.set(updatedRelease);
        this.packageInfoForm.markAsPristine();
        this.updating.set(false);
      },
      error: (err) => {
        const errorMessage = err.error?.message || err.message || 'Erro desconhecido';
        this.error.set('Erro ao atualizar informações de pacote: ' + errorMessage);
        this.updating.set(false);
      }
    });
  }

  addClient(): void {
    if (!this.clientForm.valid || !this.release()) return;
    
    const { clientCode, environment } = this.clientForm.value;
    
    // Check if client/environment combination already exists
    const existingClient = this.controlledClients().find(
      client => client.clientCode === clientCode && client.environmentName === environment
    );
    
    if (existingClient) {
      this.error.set('Este cliente já está associado a esta release neste ambiente');
      return;
    }
    
    this.updating.set(true);
    
    this.clientService.addControlledClient(
      this.release()!.id,
      { clientCode: clientCode!, environment: environment! }
    ).subscribe({
      next: (newControlledClient) => {
        // Add the new client to the existing list without reloading
        const currentClients = this.controlledClients();
        this.controlledClients.set([...currentClients, newControlledClient]);
        this.clientForm.reset();
        this.showAddClient = false;
        this.updating.set(false);
      },
      error: (err) => {
        const errorMessage = err.error?.message || err.message || 'Erro desconhecido';
        this.error.set('Erro ao adicionar cliente: ' + errorMessage);
        this.updating.set(false);
      }
    });
  }

  async removeClient(clientId: string, environmentId: string): Promise<void> {
    if (!this.release()) return;
    
    // Find the client name for the confirmation dialog
    const controlledClient = this.controlledClients().find(
      cc => cc.clientId === clientId && cc.environmentId === environmentId
    );
    const clientName = controlledClient?.clientName || 'cliente';
    const environmentName = controlledClient?.environmentName || 'ambiente';
    
    const confirmed = await this.confirmationService.confirm({
      title: 'Remover Cliente de Controlado',
      message: `Tem certeza que deseja remover o cliente "${clientName}" do ambiente "${environmentName}" da lista de controlados?\n\nEsta ação não pode ser desfeita.`,
      confirmText: 'Remover',
      cancelText: 'Cancelar',
      type: 'danger'
    });
    
    if (!confirmed) return;
    
    this.updating.set(true);
    this.clientService.removeControlledClient(
      this.release()!.id,
      clientId,
      environmentId
    ).subscribe({
      next: () => {
        // Remove the client from the existing list without reloading
        const currentClients = this.controlledClients();
        const updatedClients = currentClients.filter(
          client => !(client.clientId === clientId && client.environmentId === environmentId)
        );
        this.controlledClients.set(updatedClients);
        this.updating.set(false);
      },
      error: (err) => {
        const errorMessage = err.error?.message || err.message || 'Erro desconhecido';
        this.error.set('Erro ao remover cliente: ' + errorMessage);
        this.updating.set(false);
      }
    });
  }

  navigateBack(): void {
    this.router.navigate(['/releases']);
  }

  formatDate(date: string | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleString('pt-BR');
  }
}