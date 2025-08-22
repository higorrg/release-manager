import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';

import { ReleaseService } from '@shared/services/release.service';
import { ClientService } from '@shared/services/client.service';
import { Release, StatusOption, ClientEnvironment, HistoryEntry, AddClientEnvironmentRequest } from '@shared/models/release.model';
import { Client } from '@shared/models/client.model';

@Component({
  selector: 'app-release-detail',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTabsModule,
    MatTableModule,
    MatExpansionModule
  ],
  template: `
    <div class="release-detail-container">
      @if (loading()) {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
        </div>
      } @else if (release()) {
        <div class="header">
          <button mat-icon-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1>Release {{ release()!.version }}</h1>
        </div>

        <mat-tab-group>
          <!-- Tab: Informações Gerais -->
          <mat-tab label="Informações">
            <div class="tab-content">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Dados da Release</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="info-grid">
                    <div class="info-item">
                      <label>Produto:</label>
                      <span>{{ release()!.productName }}</span>
                    </div>
                    <div class="info-item">
                      <label>Versão:</label>
                      <span>{{ release()!.version }}</span>
                    </div>
                    <div class="info-item">
                      <label>Status Atual:</label>
                      <mat-chip 
                        [class]="'status-' + getStatusClass(release()!.status)"
                        color="primary">
                        {{ release()!.status }}
                      </mat-chip>
                    </div>
                    <div class="info-item">
                      <label>Criado em:</label>
                      <span>{{ release()!.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
                    </div>
                    <div class="info-item">
                      <label>Atualizado em:</label>
                      <span>{{ release()!.updatedAt | date:'dd/MM/yyyy HH:mm' }}</span>
                    </div>
                    @if (release()!.downloadUrl) {
                      <div class="info-item full-width">
                        <label>Download:</label>
                        <a [href]="release()!.downloadUrl" target="_blank" mat-button color="primary">
                          <mat-icon>download</mat-icon>
                          Baixar Pacote
                        </a>
                      </div>
                    }
                  </div>
                </mat-card-content>
              </mat-card>

              <!-- Atualizar Status -->
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Atualizar Status</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="status-form">
                    <mat-form-field>
                      <mat-label>Novo Status</mat-label>
                      <mat-select [(ngModel)]="statusForm.status">
                        @for (status of statusOptions(); track status.value) {
                          <mat-option [value]="status.label">{{ status.label }}</mat-option>
                        }
                      </mat-select>
                    </mat-form-field>
                    
                    <mat-form-field class="full-width">
                      <mat-label>Observação (opcional)</mat-label>
                      <textarea 
                        matInput 
                        [(ngModel)]="statusForm.observation"
                        rows="3"
                        placeholder="Adicione uma observação sobre a mudança de status...">
                      </textarea>
                    </mat-form-field>
                    
                    <button 
                      mat-raised-button 
                      color="primary"
                      (click)="updateStatus()"
                      [disabled]="!statusForm.status || updatingStatus()">
                      @if (updatingStatus()) {
                        <mat-spinner diameter="20"></mat-spinner>
                      }
                      {{ updatingStatus() ? 'Atualizando...' : 'Atualizar Status' }}
                    </button>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Tab: Clientes e Ambientes -->
          <mat-tab label="Clientes">
            <div class="tab-content">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Adicionar Cliente/Ambiente</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="client-form">
                    <mat-form-field>
                      <mat-label>Cliente</mat-label>
                      <mat-select [(ngModel)]="clientForm.clientCode">
                        @for (client of clients(); track client.id) {
                          <mat-option [value]="client.code">{{ client.name }} ({{ client.code }})</mat-option>
                        }
                      </mat-select>
                    </mat-form-field>
                    
                    <mat-form-field>
                      <mat-label>Ambiente</mat-label>
                      <mat-select [(ngModel)]="clientForm.environment">
                        <mat-option value="homologacao">Homologação</mat-option>
                        <mat-option value="producao">Produção</mat-option>
                      </mat-select>
                    </mat-form-field>
                    
                    <button 
                      mat-raised-button 
                      color="primary"
                      (click)="addClientEnvironment()"
                      [disabled]="!clientForm.clientCode || !clientForm.environment || addingClient()">
                      @if (addingClient()) {
                        <mat-spinner diameter="20"></mat-spinner>
                      }
                      {{ addingClient() ? 'Adicionando...' : 'Adicionar' }}
                    </button>
                  </div>
                </mat-card-content>
              </mat-card>

              <mat-card>
                <mat-card-header>
                  <mat-card-title>Clientes Autorizados</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  @if (clientEnvironments().length === 0) {
                    <div class="empty-state">
                      <mat-icon>group</mat-icon>
                      <p>Nenhum cliente autorizado</p>
                    </div>
                  } @else {
                    <table mat-table [dataSource]="clientEnvironments()" class="client-table">
                      <ng-container matColumnDef="client">
                        <th mat-header-cell *matHeaderCellDef>Cliente</th>
                        <td mat-cell *matCellDef="let item">
                          <div>
                            <div><strong>{{ item.clientName }}</strong></div>
                            <div class="client-code">{{ item.clientCode }}</div>
                          </div>
                        </td>
                      </ng-container>

                      <ng-container matColumnDef="environment">
                        <th mat-header-cell *matHeaderCellDef>Ambiente</th>
                        <td mat-cell *matCellDef="let item">
                          <mat-chip color="accent">
                            {{ item.environment === 'homologacao' ? 'Homologação' : 'Produção' }}
                          </mat-chip>
                        </td>
                      </ng-container>

                      <ng-container matColumnDef="actions">
                        <th mat-header-cell *matHeaderCellDef>Ações</th>
                        <td mat-cell *matCellDef="let item">
                          <button 
                            mat-icon-button 
                            color="warn"
                            (click)="removeClientEnvironment(item)">
                            <mat-icon>delete</mat-icon>
                          </button>
                        </td>
                      </ng-container>

                      <tr mat-header-row *matHeaderRowDef="clientColumns"></tr>
                      <tr mat-row *matRowDef="let row; columns: clientColumns;"></tr>
                    </table>
                  }
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Tab: Histórico -->
          <mat-tab label="Histórico">
            <div class="tab-content">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Histórico de Mudanças</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  @if (loadingHistory()) {
                    <div class="loading-container">
                      <mat-spinner diameter="40"></mat-spinner>
                    </div>
                  } @else if (history().length === 0) {
                    <div class="empty-state">
                      <mat-icon>history</mat-icon>
                      <p>Nenhum histórico encontrado</p>
                    </div>
                  } @else {
                    <mat-accordion>
                      @for (entry of history(); track entry.id) {
                        <mat-expansion-panel>
                          <mat-expansion-panel-header>
                            <mat-panel-title>
                              {{ entry.changedAt | date:'dd/MM/yyyy HH:mm' }}
                            </mat-panel-title>
                            <mat-panel-description>
                              @if (entry.previousStatus) {
                                {{ entry.previousStatus }} → {{ entry.newStatus }}
                              } @else {
                                {{ entry.newStatus }}
                              }
                            </mat-panel-description>
                          </mat-expansion-panel-header>
                          
                          <div class="history-details">
                            <div class="history-item">
                              <label>Alterado por:</label>
                              <span>{{ entry.changedBy }}</span>
                            </div>
                            @if (entry.observation) {
                              <div class="history-item">
                                <label>Observação:</label>
                                <span>{{ entry.observation }}</span>
                              </div>
                            }
                          </div>
                        </mat-expansion-panel>
                      }
                    </mat-accordion>
                  }
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>
        </mat-tab-group>
      }
    </div>
  `,
  styles: [`
    .release-detail-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 32px;
    }

    .tab-content {
      padding: 16px 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
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

    .info-item.full-width {
      grid-column: 1 / -1;
    }

    .info-item label {
      font-weight: 500;
      color: #666;
      font-size: 14px;
    }

    .status-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 400px;
    }

    .client-form {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .client-form mat-form-field {
      min-width: 200px;
    }

    .client-table {
      width: 100%;
    }

    .client-code {
      color: #666;
      font-size: 12px;
    }

    .empty-state {
      text-align: center;
      padding: 32px;
      color: #666;
    }

    .empty-state mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 16px;
    }

    .history-details {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .history-item {
      display: flex;
      gap: 8px;
    }

    .history-item label {
      font-weight: 500;
      min-width: 120px;
    }

    .full-width {
      width: 100%;
    }

    /* Status colors */
    .status-disponivel {
      background-color: #4caf50 !important;
    }

    .status-controlada {
      background-color: #9c27b0 !important;
    }

    .status-mr-aprovado {
      background-color: #2196f3 !important;
    }

    .status-teste {
      background-color: #ff9800 !important;
    }

    .status-falha {
      background-color: #f44336 !important;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReleaseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private releaseService = inject(ReleaseService);
  private clientService = inject(ClientService);

  loading = signal(true);
  loadingHistory = signal(false);
  updatingStatus = signal(false);
  addingClient = signal(false);
  
  release = signal<Release | null>(null);
  statusOptions = signal<StatusOption[]>([]);
  clients = signal<Client[]>([]);
  clientEnvironments = signal<ClientEnvironment[]>([]);
  history = signal<HistoryEntry[]>([]);

  clientColumns = ['client', 'environment', 'actions'];

  statusForm = {
    status: '',
    observation: ''
  };

  clientForm: AddClientEnvironmentRequest = {
    clientCode: '',
    environment: 'producao'
  };

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadReleaseData(id);
      this.loadStatusOptions();
      this.loadClients();
    }
  }

  private loadReleaseData(id: number) {
    this.releaseService.getReleaseById(id).subscribe({
      next: (release) => {
        this.release.set(release);
        this.loadClientEnvironments(id);
        this.loadHistory(id);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.goBack();
      }
    });
  }

  private loadStatusOptions() {
    this.releaseService.getStatusOptions().subscribe({
      next: (options) => this.statusOptions.set(options)
    });
  }

  private loadClients() {
    this.clientService.getClients(true).subscribe({
      next: (clients) => this.clients.set(clients)
    });
  }

  private loadClientEnvironments(releaseId: number) {
    this.releaseService.getClientEnvironments(releaseId).subscribe({
      next: (environments) => this.clientEnvironments.set(environments)
    });
  }

  private loadHistory(releaseId: number) {
    this.loadingHistory.set(true);
    this.releaseService.getReleaseHistory(releaseId).subscribe({
      next: (history) => {
        this.history.set(history);
        this.loadingHistory.set(false);
      },
      error: () => {
        this.loadingHistory.set(false);
      }
    });
  }

  updateStatus() {
    const release = this.release();
    if (!release || !this.statusForm.status || this.updatingStatus()) {
      return;
    }

    this.updatingStatus.set(true);

    this.releaseService.updateStatus(release.id, {
      status: this.statusForm.status,
      observation: this.statusForm.observation
    }).subscribe({
      next: () => {
        this.loadReleaseData(release.id);
        this.statusForm = { status: '', observation: '' };
        this.updatingStatus.set(false);
      },
      error: () => {
        this.updatingStatus.set(false);
      }
    });
  }

  addClientEnvironment() {
    const release = this.release();
    if (!release || !this.clientForm.clientCode || !this.clientForm.environment || this.addingClient()) {
      return;
    }

    this.addingClient.set(true);

    this.releaseService.addClientEnvironment(release.id, this.clientForm).subscribe({
      next: () => {
        this.loadClientEnvironments(release.id);
        this.clientForm = { clientCode: '', environment: 'producao' };
        this.addingClient.set(false);
      },
      error: () => {
        this.addingClient.set(false);
      }
    });
  }

  removeClientEnvironment(item: ClientEnvironment) {
    const release = this.release();
    if (!release) return;

    this.releaseService.removeClientEnvironment(release.id, {
      clientCode: item.clientCode,
      environment: item.environment as 'homologacao' | 'producao'
    }).subscribe({
      next: () => {
        this.loadClientEnvironments(release.id);
      }
    });
  }

  goBack() {
    this.router.navigate(['/releases']);
  }

  getStatusClass(status: string): string {
    if (status === 'Disponível') return 'disponivel';
    if (status === 'Controlada') return 'controlada';
    if (status === 'MR Aprovado') return 'mr-aprovado';
    if (status.includes('Teste')) return 'teste';
    if (status.includes('Falha')) return 'falha';
    return 'default';
  }
}