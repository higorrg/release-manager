import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';

import {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
  ClientFilter,
  ClientStatistics,
  ReleaseClient,
  CreateReleaseClientRequest,
  UpdateReleaseClientRequest,
  DeploymentEnvironment,
  DeploymentStatus
} from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly API_URL = 'http://localhost:8081/api/v1';

  // Signals for reactive state management
  private clientsSignal = signal<Client[]>([]);
  private currentClientSignal = signal<Client | null>(null);
  private releaseClientsSignal = signal<ReleaseClient[]>([]);
  private isLoadingSignal = signal<boolean>(false);
  private statisticsSignal = signal<ClientStatistics | null>(null);

  // Readonly signals
  public clients = this.clientsSignal.asReadonly();
  public currentClient = this.currentClientSignal.asReadonly();
  public releaseClients = this.releaseClientsSignal.asReadonly();
  public isLoading = this.isLoadingSignal.asReadonly();
  public statistics = this.statisticsSignal.asReadonly();

  constructor(
    private http: HttpClient,
    private message: NzMessageService
  ) {}

  // ========== CLIENT MANAGEMENT ==========

  // GET all clients with optional filters
  getClients(filter?: ClientFilter): Observable<Client[]> {
    this.isLoadingSignal.set(true);
    
    let params = new HttpParams();
    if (filter) {
      if (filter.search) {
        params = params.set('search', filter.search);
      }
      if (filter.clientType?.length) {
        filter.clientType.forEach(type => {
          params = params.append('clientType', type);
        });
      }
      if (filter.priority?.length) {
        filter.priority.forEach(priority => {
          params = params.append('priority', priority);
        });
      }
      if (filter.region?.length) {
        filter.region.forEach(region => {
          params = params.append('region', region);
        });
      }
      if (filter.isActive !== undefined) {
        params = params.set('isActive', filter.isActive.toString());
      }
    }

    return this.http.get<Client[]>(`${this.API_URL}/clients`, { params })
      .pipe(
        tap(clients => {
          this.clientsSignal.set(clients);
          this.isLoadingSignal.set(false);
        }),
        catchError(error => {
          this.isLoadingSignal.set(false);
          this.message.error('Erro ao carregar clientes.');
          return throwError(() => error);
        })
      );
  }

  // GET client by ID
  getClientById(id: number): Observable<Client> {
    this.isLoadingSignal.set(true);
    
    return this.http.get<Client>(`${this.API_URL}/clients/${id}`)
      .pipe(
        tap(client => {
          this.currentClientSignal.set(client);
          this.isLoadingSignal.set(false);
        }),
        catchError(error => {
          this.isLoadingSignal.set(false);
          this.message.error('Erro ao carregar cliente.');
          return throwError(() => error);
        })
      );
  }

  // CREATE new client
  createClient(clientData: CreateClientRequest): Observable<Client> {
    this.isLoadingSignal.set(true);
    
    return this.http.post<Client>(`${this.API_URL}/clients`, clientData)
      .pipe(
        tap(newClient => {
          const currentClients = this.clientsSignal();
          this.clientsSignal.set([newClient, ...currentClients]);
          this.currentClientSignal.set(newClient);
          this.isLoadingSignal.set(false);
          this.message.success('Cliente criado com sucesso!');
        }),
        catchError(error => {
          this.isLoadingSignal.set(false);
          this.message.error('Erro ao criar cliente.');
          return throwError(() => error);
        })
      );
  }

  // UPDATE client
  updateClient(id: number, updateData: UpdateClientRequest): Observable<Client> {
    this.isLoadingSignal.set(true);
    
    return this.http.put<Client>(`${this.API_URL}/clients/${id}`, updateData)
      .pipe(
        tap(updatedClient => {
          const clients = this.clientsSignal();
          const index = clients.findIndex(c => c.id === id);
          if (index !== -1) {
            const newClients = [...clients];
            newClients[index] = updatedClient;
            this.clientsSignal.set(newClients);
          }
          this.currentClientSignal.set(updatedClient);
          this.isLoadingSignal.set(false);
          this.message.success('Cliente atualizado com sucesso!');
        }),
        catchError(error => {
          this.isLoadingSignal.set(false);
          this.message.error('Erro ao atualizar cliente.');
          return throwError(() => error);
        })
      );
  }

  // DELETE client
  deleteClient(id: number): Observable<void> {
    this.isLoadingSignal.set(true);
    
    return this.http.delete<void>(`${this.API_URL}/clients/${id}`)
      .pipe(
        tap(() => {
          const clients = this.clientsSignal();
          this.clientsSignal.set(clients.filter(c => c.id !== id));
          if (this.currentClientSignal()?.id === id) {
            this.currentClientSignal.set(null);
          }
          this.isLoadingSignal.set(false);
          this.message.success('Cliente excluído com sucesso!');
        }),
        catchError(error => {
          this.isLoadingSignal.set(false);
          this.message.error('Erro ao excluir cliente.');
          return throwError(() => error);
        })
      );
  }

  // ========== RELEASE CLIENT MANAGEMENT ==========

  // GET clients for a release
  getReleaseClients(releaseId: number): Observable<ReleaseClient[]> {
    this.isLoadingSignal.set(true);
    
    return this.http.get<ReleaseClient[]>(`${this.API_URL}/releases/${releaseId}/clients`)
      .pipe(
        tap(releaseClients => {
          this.releaseClientsSignal.set(releaseClients);
          this.isLoadingSignal.set(false);
        }),
        catchError(error => {
          this.isLoadingSignal.set(false);
          this.message.error('Erro ao carregar clientes do release.');
          return throwError(() => error);
        })
      );
  }

  // ADD client to release
  addClientToRelease(releaseClientData: CreateReleaseClientRequest): Observable<ReleaseClient> {
    this.isLoadingSignal.set(true);
    
    return this.http.post<ReleaseClient>(`${this.API_URL}/releases/${releaseClientData.releaseId}/clients`, releaseClientData)
      .pipe(
        tap(newReleaseClient => {
          const currentReleaseClients = this.releaseClientsSignal();
          this.releaseClientsSignal.set([...currentReleaseClients, newReleaseClient]);
          this.isLoadingSignal.set(false);
          this.message.success('Cliente adicionado ao release com sucesso!');
        }),
        catchError(error => {
          this.isLoadingSignal.set(false);
          if (error.status === 409) {
            this.message.error('Cliente já está associado a este release neste ambiente.');
          } else {
            this.message.error('Erro ao adicionar cliente ao release.');
          }
          return throwError(() => error);
        })
      );
  }

  // UPDATE release client
  updateReleaseClient(releaseId: number, clientId: number, updateData: UpdateReleaseClientRequest): Observable<ReleaseClient> {
    this.isLoadingSignal.set(true);
    
    return this.http.put<ReleaseClient>(`${this.API_URL}/releases/${releaseId}/clients/${clientId}`, updateData)
      .pipe(
        tap(updatedReleaseClient => {
          const releaseClients = this.releaseClientsSignal();
          const index = releaseClients.findIndex(rc => rc.releaseId === releaseId && rc.clientId === clientId);
          if (index !== -1) {
            const newReleaseClients = [...releaseClients];
            newReleaseClients[index] = updatedReleaseClient;
            this.releaseClientsSignal.set(newReleaseClients);
          }
          this.isLoadingSignal.set(false);
          this.message.success('Cliente do release atualizado com sucesso!');
        }),
        catchError(error => {
          this.isLoadingSignal.set(false);
          this.message.error('Erro ao atualizar cliente do release.');
          return throwError(() => error);
        })
      );
  }

  // REMOVE client from release
  removeClientFromRelease(releaseId: number, clientId: number): Observable<void> {
    this.isLoadingSignal.set(true);
    
    return this.http.delete<void>(`${this.API_URL}/releases/${releaseId}/clients/${clientId}`)
      .pipe(
        tap(() => {
          const releaseClients = this.releaseClientsSignal();
          this.releaseClientsSignal.set(
            releaseClients.filter(rc => !(rc.releaseId === releaseId && rc.clientId === clientId))
          );
          this.isLoadingSignal.set(false);
          this.message.success('Cliente removido do release com sucesso!');
        }),
        catchError(error => {
          this.isLoadingSignal.set(false);
          this.message.error('Erro ao remover cliente do release.');
          return throwError(() => error);
        })
      );
  }

  // ========== STATISTICS ==========

  // GET client statistics
  getClientStatistics(): Observable<ClientStatistics> {
    return this.http.get<ClientStatistics>(`${this.API_URL}/clients/statistics`)
      .pipe(
        tap(stats => {
          this.statisticsSignal.set(stats);
        }),
        catchError(error => {
          this.message.error('Erro ao carregar estatísticas dos clientes.');
          return throwError(() => error);
        })
      );
  }

  // ========== UTILITY METHODS ==========

  getEnvironmentColor(environment: DeploymentEnvironment): string {
    const environmentColors = {
      [DeploymentEnvironment.DEVELOPMENT]: 'blue',
      [DeploymentEnvironment.STAGING]: 'gold',
      [DeploymentEnvironment.PRODUCTION]: 'red'
    };
    return environmentColors[environment];
  }

  getEnvironmentText(environment: DeploymentEnvironment): string {
    const environmentTexts = {
      [DeploymentEnvironment.DEVELOPMENT]: 'Desenvolvimento',
      [DeploymentEnvironment.STAGING]: 'Homologação',
      [DeploymentEnvironment.PRODUCTION]: 'Produção'
    };
    return environmentTexts[environment];
  }

  getDeploymentStatusColor(status: DeploymentStatus): string {
    const statusColors = {
      [DeploymentStatus.PENDING]: 'default',
      [DeploymentStatus.IN_PROGRESS]: 'blue',
      [DeploymentStatus.COMPLETED]: 'green',
      [DeploymentStatus.FAILED]: 'red',
      [DeploymentStatus.ROLLBACK]: 'orange'
    };
    return statusColors[status];
  }

  getDeploymentStatusText(status: DeploymentStatus): string {
    const statusTexts = {
      [DeploymentStatus.PENDING]: 'Pendente',
      [DeploymentStatus.IN_PROGRESS]: 'Em Progresso',
      [DeploymentStatus.COMPLETED]: 'Concluído',
      [DeploymentStatus.FAILED]: 'Falhou',
      [DeploymentStatus.ROLLBACK]: 'Rollback'
    };
    return statusTexts[status];
  }

  // Clear signals
  clearCurrentClient(): void {
    this.currentClientSignal.set(null);
  }

  clearReleaseClients(): void {
    this.releaseClientsSignal.set([]);
  }
}