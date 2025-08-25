import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';

import {
  ReleaseHistory,
  CreateReleaseHistoryRequest,
  ReleaseHistoryFilter,
  ReleaseTimeline,
  TimelineEvent
} from '../models/release-history.model';

@Injectable({
  providedIn: 'root'
})
export class ReleaseHistoryService {
  private readonly API_URL = 'http://localhost:8080/api/v1';

  // Signals for reactive state management
  private historySignal = signal<ReleaseHistory[]>([]);
  private timelineSignal = signal<ReleaseTimeline[]>([]);
  private isLoadingSignal = signal<boolean>(false);

  // Readonly signals
  public history = this.historySignal.asReadonly();
  public timeline = this.timelineSignal.asReadonly();
  public isLoading = this.isLoadingSignal.asReadonly();

  constructor(
    private http: HttpClient,
    private message: NzMessageService
  ) {}

  // ========== RELEASE HISTORY ==========

  // GET release history with optional filters
  getReleaseHistory(filter?: ReleaseHistoryFilter): Observable<ReleaseHistory[]> {
    this.isLoadingSignal.set(true);
    
    let params = new HttpParams();
    if (filter) {
      if (filter.releaseId) {
        params = params.set('releaseId', filter.releaseId.toString());
      }
      if (filter.status?.length) {
        filter.status.forEach(status => {
          params = params.append('status', status);
        });
      }
      if (filter.changedBy?.length) {
        filter.changedBy.forEach(userId => {
          params = params.append('changedBy', userId.toString());
        });
      }
      if (filter.dateFrom) {
        params = params.set('dateFrom', filter.dateFrom.toISOString());
      }
      if (filter.dateTo) {
        params = params.set('dateTo', filter.dateTo.toISOString());
      }
    }

    return this.http.get<ReleaseHistory[]>(`${this.API_URL}/releases/history`, { params })
      .pipe(
        tap(history => {
          this.historySignal.set(history);
          this.isLoadingSignal.set(false);
        }),
        catchError(error => {
          this.isLoadingSignal.set(false);
          this.message.error('Erro ao carregar histórico dos releases.');
          return throwError(() => error);
        })
      );
  }

  // GET history for specific release
  getReleaseHistoryById(releaseId: number): Observable<ReleaseHistory[]> {
    this.isLoadingSignal.set(true);
    
    return this.http.get<ReleaseHistory[]>(`${this.API_URL}/releases/${releaseId}/history`)
      .pipe(
        tap(history => {
          this.historySignal.set(history);
          this.isLoadingSignal.set(false);
        }),
        catchError(error => {
          this.isLoadingSignal.set(false);
          this.message.error('Erro ao carregar histórico do release.');
          return throwError(() => error);
        })
      );
  }

  // CREATE new history entry
  createHistoryEntry(historyData: CreateReleaseHistoryRequest): Observable<ReleaseHistory> {
    return this.http.post<ReleaseHistory>(`${this.API_URL}/releases/history`, historyData)
      .pipe(
        tap(newHistory => {
          const currentHistory = this.historySignal();
          this.historySignal.set([newHistory, ...currentHistory]);
        }),
        catchError(error => {
          this.message.error('Erro ao criar entrada no histórico.');
          return throwError(() => error);
        })
      );
  }

  // ========== RELEASE TIMELINE ==========

  // GET timeline for specific release
  getReleaseTimeline(releaseId: number): Observable<ReleaseTimeline[]> {
    this.isLoadingSignal.set(true);
    
    return this.http.get<ReleaseTimeline[]>(`${this.API_URL}/releases/${releaseId}/timeline`)
      .pipe(
        tap(timeline => {
          this.timelineSignal.set(timeline);
          this.isLoadingSignal.set(false);
        }),
        catchError(error => {
          this.isLoadingSignal.set(false);
          this.message.error('Erro ao carregar timeline do release.');
          return throwError(() => error);
        })
      );
  }

  // ADD timeline entry
  addTimelineEntry(releaseId: number, event: TimelineEvent, description: string, metadata?: Record<string, any>): Observable<ReleaseTimeline> {
    const timelineData = {
      releaseId,
      event,
      description,
      metadata
    };

    return this.http.post<ReleaseTimeline>(`${this.API_URL}/releases/${releaseId}/timeline`, timelineData)
      .pipe(
        tap(newEntry => {
          const currentTimeline = this.timelineSignal();
          this.timelineSignal.set([newEntry, ...currentTimeline]);
        }),
        catchError(error => {
          this.message.error('Erro ao adicionar entrada na timeline.');
          return throwError(() => error);
        })
      );
  }

  // ========== UTILITY METHODS ==========

  getEventColor(event: TimelineEvent): string {
    const eventColors = {
      [TimelineEvent.CREATED]: 'green',
      [TimelineEvent.STATUS_CHANGED]: 'blue',
      [TimelineEvent.CLIENT_ADDED]: 'cyan',
      [TimelineEvent.CLIENT_REMOVED]: 'orange',
      [TimelineEvent.PACKAGE_UPLOADED]: 'purple',
      [TimelineEvent.PACKAGE_DOWNLOADED]: 'magenta',
      [TimelineEvent.NOTE_ADDED]: 'gold',
      [TimelineEvent.SCHEDULED]: 'lime',
      [TimelineEvent.DEPLOYED]: 'red'
    };
    return eventColors[event];
  }

  getEventIcon(event: TimelineEvent): string {
    const eventIcons = {
      [TimelineEvent.CREATED]: 'plus-circle',
      [TimelineEvent.STATUS_CHANGED]: 'edit',
      [TimelineEvent.CLIENT_ADDED]: 'user-add',
      [TimelineEvent.CLIENT_REMOVED]: 'user-delete',
      [TimelineEvent.PACKAGE_UPLOADED]: 'upload',
      [TimelineEvent.PACKAGE_DOWNLOADED]: 'download',
      [TimelineEvent.NOTE_ADDED]: 'file-text',
      [TimelineEvent.SCHEDULED]: 'calendar',
      [TimelineEvent.DEPLOYED]: 'rocket'
    };
    return eventIcons[event];
  }

  getEventText(event: TimelineEvent): string {
    const eventTexts = {
      [TimelineEvent.CREATED]: 'Criado',
      [TimelineEvent.STATUS_CHANGED]: 'Status Alterado',
      [TimelineEvent.CLIENT_ADDED]: 'Cliente Adicionado',
      [TimelineEvent.CLIENT_REMOVED]: 'Cliente Removido',
      [TimelineEvent.PACKAGE_UPLOADED]: 'Pacote Enviado',
      [TimelineEvent.PACKAGE_DOWNLOADED]: 'Pacote Baixado',
      [TimelineEvent.NOTE_ADDED]: 'Nota Adicionada',
      [TimelineEvent.SCHEDULED]: 'Agendado',
      [TimelineEvent.DEPLOYED]: 'Implantado'
    };
    return eventTexts[event];
  }

  formatHistoryMessage(history: ReleaseHistory): string {
    const statusText = this.getStatusDisplayText(history.newStatus);
    const userName = history.changedByUser?.name || 'Sistema';
    
    if (history.previousStatus) {
      const previousStatusText = this.getStatusDisplayText(history.previousStatus);
      return `${userName} alterou o status de "${previousStatusText}" para "${statusText}"`;
    } else {
      return `${userName} definiu o status como "${statusText}"`;
    }
  }

  private getStatusDisplayText(status: string): string {
    const statusDisplayTexts: Record<string, string> = {
      'PENDING': 'Pendente',
      'IN_PROGRESS': 'Em Progresso',
      'TESTING': 'Em Teste',
      'COMPLETED': 'Concluído',
      'CANCELLED': 'Cancelado',
      'ON_HOLD': 'Em Espera'
    };
    return statusDisplayTexts[status] || status;
  }

  // Format relative time
  getRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) {
      return 'Agora';
    } else if (minutes < 60) {
      return `${minutes} min atrás`;
    } else if (hours < 24) {
      return `${hours}h atrás`;
    } else if (days < 7) {
      return `${days}d atrás`;
    } else {
      return new Date(date).toLocaleDateString('pt-BR');
    }
  }

  // Clear signals
  clearHistory(): void {
    this.historySignal.set([]);
  }

  clearTimeline(): void {
    this.timelineSignal.set([]);
  }
}