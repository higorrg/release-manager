import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Release {
  id: string;
  productId: string;
  version: string;
  majorVersion: number;
  minorVersion: number;
  patchVersion: number;
  status: ReleaseStatus;
  statusDisplayName: string;
  releaseNotes?: string;
  prerequisites?: string;
  downloadUrl?: string;
  packagePath?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReleaseStatusHistory {
  id: string;
  releaseId: string;
  previousStatus?: ReleaseStatus;
  previousStatusDisplayName?: string;
  newStatus: ReleaseStatus;
  newStatusDisplayName: string;
  changedBy: string;
  changedAt: string;
  comments?: string;
}

export enum ReleaseStatus {
  MR_APROVADO = 'MR_APROVADO',
  FALHA_BUILD_TESTE = 'FALHA_BUILD_TESTE',
  PARA_TESTE_SISTEMA = 'PARA_TESTE_SISTEMA',
  REPROVADA_TESTE = 'REPROVADA_TESTE',
  APROVADA_TESTE = 'APROVADA_TESTE',
  FALHA_BUILD_PRODUCAO = 'FALHA_BUILD_PRODUCAO',
  PARA_TESTE_REGRESSIVO = 'PARA_TESTE_REGRESSIVO',
  FALHA_INSTALACAO_ESTAVEL = 'FALHA_INSTALACAO_ESTAVEL',
  INTERNO = 'INTERNO',
  REVOGADA = 'REVOGADA',
  REPROVADA_TESTE_REGRESSIVO = 'REPROVADA_TESTE_REGRESSIVO',
  APROVADA_TESTE_REGRESSIVO = 'APROVADA_TESTE_REGRESSIVO',
  CONTROLADA = 'CONTROLADA',
  DISPONIVEL = 'DISPONIVEL'
}

export interface CreateReleaseRequest {
  productName: string;
  version: string;
}

export interface UpdateStatusRequest {
  status: ReleaseStatus;
  comments?: string;
}

export interface UpdateReleaseNotesRequest {
  releaseNotes: string;
}

export interface UpdatePrerequisitesRequest {
  prerequisites: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReleaseService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private readonly apiUrl = 'http://localhost:8081/api/v1/releases';

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  createReleaseFromPipeline(request: CreateReleaseRequest): Observable<Release> {
    return this.http.post<Release>(`${this.apiUrl}/pipeline`, request, {
      headers: this.getHeaders()
    });
  }

  updateReleaseStatus(releaseId: string, request: UpdateStatusRequest): Observable<Release> {
    return this.http.put<Release>(`${this.apiUrl}/${releaseId}/status`, request, {
      headers: this.getHeaders()
    });
  }

  updateReleaseNotes(releaseId: string, request: UpdateReleaseNotesRequest): Observable<Release> {
    return this.http.put<Release>(`${this.apiUrl}/${releaseId}/release-notes`, request, {
      headers: this.getHeaders()
    });
  }

  updatePrerequisites(releaseId: string, request: UpdatePrerequisitesRequest): Observable<Release> {
    return this.http.put<Release>(`${this.apiUrl}/${releaseId}/prerequisites`, request, {
      headers: this.getHeaders()
    });
  }

  getReleaseById(releaseId: string): Observable<Release> {
    return this.http.get<Release>(`${this.apiUrl}/${releaseId}`, {
      headers: this.getHeaders()
    });
  }

  getReleaseStatusHistory(releaseId: string): Observable<ReleaseStatusHistory[]> {
    return this.http.get<ReleaseStatusHistory[]>(`${this.apiUrl}/${releaseId}/history`, {
      headers: this.getHeaders()
    });
  }

  getStatusDisplayNames(): Record<ReleaseStatus, string> {
    return {
      [ReleaseStatus.MR_APROVADO]: 'MR Aprovado',
      [ReleaseStatus.FALHA_BUILD_TESTE]: 'Falha no Build para Teste',
      [ReleaseStatus.PARA_TESTE_SISTEMA]: 'Para Teste de Sistema',
      [ReleaseStatus.REPROVADA_TESTE]: 'Reprovada no teste',
      [ReleaseStatus.APROVADA_TESTE]: 'Aprovada no teste',
      [ReleaseStatus.FALHA_BUILD_PRODUCAO]: 'Falha no Build para Produção',
      [ReleaseStatus.PARA_TESTE_REGRESSIVO]: 'Para Teste Regressivo',
      [ReleaseStatus.FALHA_INSTALACAO_ESTAVEL]: 'Falha na instalação da Estável',
      [ReleaseStatus.INTERNO]: 'Interno',
      [ReleaseStatus.REVOGADA]: 'Revogada',
      [ReleaseStatus.REPROVADA_TESTE_REGRESSIVO]: 'Reprovada no teste regressivo',
      [ReleaseStatus.APROVADA_TESTE_REGRESSIVO]: 'Aprovada no teste regressivo',
      [ReleaseStatus.CONTROLADA]: 'Controlada',
      [ReleaseStatus.DISPONIVEL]: 'Disponível'
    };
  }

  getAvailableStatuses(): ReleaseStatus[] {
    return Object.values(ReleaseStatus);
  }
}