import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';

import {
  Release,
  CreateReleaseRequest,
  UpdateReleaseRequest,
  UpdateReleaseStatusRequest,
  ReleasePackage,
  ReleaseStatistics,
  ReleaseFilter,
  ReleaseStatus,
  ReleaseStatusDisplayNames
} from '../models/release.model';

@Injectable({
  providedIn: 'root'
})
export class ReleaseService {
  private readonly API_URL = 'http://localhost:8081/api/v1';

  // Signals for reactive state management
  private releasesSignal = signal<Release[]>([]);
  private currentReleaseSignal = signal<Release | null>(null);
  private isLoadingSignal = signal<boolean>(false);
  private statisticsSignal = signal<ReleaseStatistics | null>(null);

  // Readonly signals
  public releases = this.releasesSignal.asReadonly();
  public currentRelease = this.currentReleaseSignal.asReadonly();
  public isLoading = this.isLoadingSignal.asReadonly();
  public statistics = this.statisticsSignal.asReadonly();

  constructor(
    private http: HttpClient,
    private message: NzMessageService
  ) {}

  // GET all releases with optional filters
  getReleases(filter?: ReleaseFilter): Observable<Release[]> {
    this.isLoadingSignal.set(true);
    
    let params = new HttpParams();
    if (filter) {
      if (filter.status?.length) {
        filter.status.forEach(status => {
          params = params.append('status', status);
        });
      }
      if (filter.priority?.length) {
        filter.priority.forEach(priority => {
          params = params.append('priority', priority);
        });
      }
      if (filter.product?.length) {
        filter.product.forEach(product => {
          params = params.append('product', product);
        });
      }
      if (filter.search) {
        params = params.set('search', filter.search);
      }
      if (filter.dateFrom) {
        params = params.set('dateFrom', filter.dateFrom.toISOString());
      }
      if (filter.dateTo) {
        params = params.set('dateTo', filter.dateTo.toISOString());
      }
      if (filter.createdBy?.length) {
        filter.createdBy.forEach(userId => {
          params = params.append('createdBy', userId.toString());
        });
      }
    }

    return this.http.get<Release[]>(`${this.API_URL}/releases`, { params })
      .pipe(
        tap(releases => {
          this.releasesSignal.set(releases);
          this.isLoadingSignal.set(false);
        }),
        catchError(error => {
          this.isLoadingSignal.set(false);
          this.message.error('Erro ao carregar releases.');
          return throwError(() => error);
        })
      );
  }

  // GET release by ID
  getReleaseById(id: string): Observable<Release> {
    this.isLoadingSignal.set(true);
    
    return this.http.get<Release>(`${this.API_URL}/releases/${id}`)
      .pipe(
        tap(release => {
          this.currentReleaseSignal.set(release);
          this.isLoadingSignal.set(false);
        }),
        catchError(error => {
          this.isLoadingSignal.set(false);
          this.message.error('Erro ao carregar release.');
          return throwError(() => error);
        })
      );
  }

  // CREATE new release
  createRelease(releaseData: CreateReleaseRequest): Observable<Release> {
    this.isLoadingSignal.set(true);
    
    return this.http.post<Release>(`${this.API_URL}/releases`, releaseData)
      .pipe(
        tap(newRelease => {
          const currentReleases = this.releasesSignal();
          this.releasesSignal.set([newRelease, ...currentReleases]);
          this.currentReleaseSignal.set(newRelease);
          this.isLoadingSignal.set(false);
          this.message.success('Release criado com sucesso!');
        }),
        catchError(error => {
          this.isLoadingSignal.set(false);
          this.message.error('Erro ao criar release.');
          return throwError(() => error);
        })
      );
  }

  // UPDATE release
  updateRelease(id: string, updateData: UpdateReleaseRequest): Observable<Release> {
    this.isLoadingSignal.set(true);
    
    return this.http.put<Release>(`${this.API_URL}/releases/${id}`, updateData)
      .pipe(
        tap(updatedRelease => {
          const releases = this.releasesSignal();
          const index = releases.findIndex(r => r.id === id);
          if (index !== -1) {
            const newReleases = [...releases];
            newReleases[index] = updatedRelease;
            this.releasesSignal.set(newReleases);
          }
          this.currentReleaseSignal.set(updatedRelease);
          this.isLoadingSignal.set(false);
          this.message.success('Release atualizado com sucesso!');
        }),
        catchError(error => {
          this.isLoadingSignal.set(false);
          this.message.error('Erro ao atualizar release.');
          return throwError(() => error);
        })
      );
  }

  // UPDATE release status
  updateReleaseStatus(id: string, statusUpdate: UpdateReleaseStatusRequest): Observable<Release> {
    this.isLoadingSignal.set(true);
    
    return this.http.put<Release>(`${this.API_URL}/releases/${id}/status`, statusUpdate)
      .pipe(
        tap(updatedRelease => {
          const releases = this.releasesSignal();
          const index = releases.findIndex(r => r.id === id);
          if (index !== -1) {
            const newReleases = [...releases];
            newReleases[index] = updatedRelease;
            this.releasesSignal.set(newReleases);
          }
          this.currentReleaseSignal.set(updatedRelease);
          this.isLoadingSignal.set(false);
          this.message.success('Status do release atualizado com sucesso!');
        }),
        catchError(error => {
          this.isLoadingSignal.set(false);
          this.message.error('Erro ao atualizar status do release.');
          return throwError(() => error);
        })
      );
  }

  // DELETE release
  deleteRelease(id: string): Observable<void> {
    this.isLoadingSignal.set(true);
    
    return this.http.delete<void>(`${this.API_URL}/releases/${id}`)
      .pipe(
        tap(() => {
          const releases = this.releasesSignal();
          this.releasesSignal.set(releases.filter(r => r.id !== id));
          if (this.currentReleaseSignal()?.id === id) {
            this.currentReleaseSignal.set(null);
          }
          this.isLoadingSignal.set(false);
          this.message.success('Release excluído com sucesso!');
        }),
        catchError(error => {
          this.isLoadingSignal.set(false);
          this.message.error('Erro ao excluir release.');
          return throwError(() => error);
        })
      );
  }

  // GET release packages
  getReleasePackages(releaseId: string): Observable<ReleasePackage[]> {
    return this.http.get<ReleasePackage[]>(`${this.API_URL}/releases/${releaseId}/packages`)
      .pipe(
        catchError(error => {
          this.message.error('Erro ao carregar pacotes do release.');
          return throwError(() => error);
        })
      );
  }

  // UPLOAD release package
  uploadReleasePackage(releaseId: string, file: File): Observable<ReleasePackage> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<ReleasePackage>(`${this.API_URL}/releases/${releaseId}/packages/upload`, formData)
      .pipe(
        tap(() => {
          this.message.success('Pacote enviado com sucesso!');
        }),
        catchError(error => {
          this.message.error('Erro ao enviar pacote.');
          return throwError(() => error);
        })
      );
  }

  // DOWNLOAD release package
  downloadReleasePackage(releaseId: string, packageId: number): Observable<Blob> {
    return this.http.get(`${this.API_URL}/releases/${releaseId}/packages/${packageId}/download`, {
      responseType: 'blob'
    }).pipe(
      catchError(error => {
        this.message.error('Erro ao baixar pacote.');
        return throwError(() => error);
      })
    );
  }

  // GET release statistics
  getReleaseStatistics(): Observable<ReleaseStatistics> {
    return this.http.get<ReleaseStatistics>(`${this.API_URL}/releases/statistics`)
      .pipe(
        tap(stats => {
          this.statisticsSignal.set(stats);
        }),
        catchError(error => {
          this.message.error('Erro ao carregar estatísticas.');
          return throwError(() => error);
        })
      );
  }

  // Utility methods
  getStatusColor(status: ReleaseStatus): string {
    const statusColors = {
      [ReleaseStatus.MR_APROVADO]: '#1890ff',
      [ReleaseStatus.FALHA_BUILD_TESTE]: '#f5222d',
      [ReleaseStatus.PARA_TESTE_SISTEMA]: '#faad14',
      [ReleaseStatus.EM_TESTE_SISTEMA]: '#722ed1',
      [ReleaseStatus.REPROVADA_TESTE]: '#f5222d',
      [ReleaseStatus.APROVADA_TESTE]: '#52c41a',
      [ReleaseStatus.FALHA_BUILD_PRODUCAO]: '#f5222d',
      [ReleaseStatus.PARA_TESTE_REGRESSIVO]: '#faad14',
      [ReleaseStatus.EM_TESTE_REGRESSIVO]: '#722ed1',
      [ReleaseStatus.FALHA_INSTALACAO_ESTAVEL]: '#f5222d',
      [ReleaseStatus.INTERNO]: '#d9d9d9',
      [ReleaseStatus.REVOGADA]: '#f5222d',
      [ReleaseStatus.REPROVADA_TESTE_REGRESSIVO]: '#f5222d',
      [ReleaseStatus.APROVADA_TESTE_REGRESSIVO]: '#52c41a',
      [ReleaseStatus.CONTROLADA]: '#a0d911',
      [ReleaseStatus.DISPONIVEL]: '#52c41a'
    };
    return statusColors[status] || '#d9d9d9';
  }

  getStatusText(status: ReleaseStatus): string {
    return ReleaseStatusDisplayNames[status];
  }

  // Clear current release
  clearCurrentRelease(): void {
    this.currentReleaseSignal.set(null);
  }
}