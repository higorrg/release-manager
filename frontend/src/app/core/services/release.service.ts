import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface ControlledClient {
    id: string;
    clientCode: string;
    environment: 'homologacao' | 'producao';
}

export interface Release {
    id: string;
    productId: string;
    product: string;
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
    controlledClients?: ControlledClient[];
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

export type ReleaseStatus = 
    'MR Aprovado' |
    'Falha no Build para Teste' |
    'Para Teste de Sistema' |
    'Reprovada no teste' |
    'Aprovada no teste' |
    'Falha no Build para Produção' |
    'Para Teste Regressivo' |
    'Falha na instalação da Estável' |
    'Interno' |
    'Revogada' |
    'Reprovada no teste regressivo' |
    'Aprovada no teste regressivo' |
    'Controlada' |
    'Disponível';

export interface CreateReleaseRequest {
    productName: string;
    version: string;
}

export interface UpdateStatusRequest {
    newStatus: string;
    changedBy: string;
    comments?: string;
}

export interface UpdateReleaseNotesRequest {
    releaseNotes: string;
}

export interface UpdatePrerequisitesRequest {
    prerequisites: string;
}

export interface UpdatePackageInfoRequest {
    downloadUrl?: string;
    packagePath?: string;
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

    createReleaseFromWeb(request: CreateReleaseRequest): Observable<Release> {
        return this.http.post<Release>(`${this.apiUrl}`, request, {
            headers: this.getHeaders()
        });
    }

    getAllReleases(): Observable<Release[]> {
        return this.http.get<Release[]>(this.apiUrl, {
            headers: this.getHeaders()
        });
    }

    getReleasesByProduct(productId: string): Observable<Release[]> {
        return this.http.get<Release[]>(`${this.apiUrl}?productId=${productId}`, {
            headers: this.getHeaders()
        });
    }

    updateReleaseStatus(releaseId: string, status: ReleaseStatus, comments?: string): Observable<Release> {
        // Convert display name back to enum value
        const statusEnum = this.getStatusEnumValue(status);
        const currentUser = this.authService.getUserName() || 'Unknown User';
        
        const request: UpdateStatusRequest = { 
            newStatus: statusEnum, 
            changedBy: currentUser,
            comments: comments 
        };
        return this.http.put<Release>(`${this.apiUrl}/${releaseId}/status`, request, {
            headers: this.getHeaders()
        });
    }

    private getStatusEnumValue(displayName: ReleaseStatus): string {
        const statusMap: Record<ReleaseStatus, string> = {
            'MR Aprovado': 'MR_APROVADO',
            'Falha no Build para Teste': 'FALHA_BUILD_TESTE',
            'Para Teste de Sistema': 'PARA_TESTE_SISTEMA',
            'Reprovada no teste': 'REPROVADA_TESTE',
            'Aprovada no teste': 'APROVADA_TESTE',
            'Falha no Build para Produção': 'FALHA_BUILD_PRODUCAO',
            'Para Teste Regressivo': 'PARA_TESTE_REGRESSIVO',
            'Falha na instalação da Estável': 'FALHA_INSTALACAO_ESTAVEL',
            'Interno': 'INTERNO',
            'Revogada': 'REVOGADA',
            'Reprovada no teste regressivo': 'REPROVADA_TESTE_REGRESSIVO',
            'Aprovada no teste regressivo': 'APROVADA_TESTE_REGRESSIVO',
            'Controlada': 'CONTROLADA',
            'Disponível': 'DISPONIVEL'
        };
        return statusMap[displayName] || displayName;
    }

    updateReleaseNotes(releaseId: string, releaseNotes: string): Observable<Release> {
        const request: UpdateReleaseNotesRequest = { releaseNotes };
        return this.http.put<Release>(`${this.apiUrl}/${releaseId}/release-notes`, request, {
            headers: this.getHeaders()
        });
    }

    updatePrerequisites(releaseId: string, prerequisites: string): Observable<Release> {
        const request: UpdatePrerequisitesRequest = { prerequisites };
        return this.http.put<Release>(`${this.apiUrl}/${releaseId}/prerequisites`, request, {
            headers: this.getHeaders()
        });
    }

    updatePackageInfo(releaseId: string, downloadUrl?: string, packagePath?: string): Observable<Release> {
        const request: UpdatePackageInfoRequest = { downloadUrl, packagePath };
        return this.http.put<Release>(`${this.apiUrl}/${releaseId}/package-info`, request, {
            headers: this.getHeaders()
        });
    }

    getRelease(releaseId: string): Observable<Release> {
        return this.http.get<Release>(`${this.apiUrl}/${releaseId}`, {
            headers: this.getHeaders()
        });
    }
    
    getReleaseById(releaseId: string): Observable<Release> {
        return this.getRelease(releaseId);
    }

    getReleaseStatusHistory(releaseId: string): Observable<ReleaseStatusHistory[]> {
        return this.http.get<ReleaseStatusHistory[]>(`${this.apiUrl}/${releaseId}/history`, {
            headers: this.getHeaders()
        });
    }


    getAvailableStatuses(): ReleaseStatus[] {
        return [
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
    }

    addControlledClient(releaseId: string, clientCode: string, environment: string): Observable<Release> {
        const request = { clientCode, environment };
        return this.http.post<any>(`${this.apiUrl}/${releaseId}/controlled-clients`, request, {
            headers: this.getHeaders()
        }).pipe(
            switchMap(() => this.getRelease(releaseId))
        );
    }

    removeControlledClient(releaseId: string, clientId: string, environmentId: string): Observable<Release> {
        return this.http.delete<void>(`${this.apiUrl}/${releaseId}/controlled-clients/${clientId}/environments/${environmentId}`, {
            headers: this.getHeaders()
        }).pipe(
            switchMap(() => this.getRelease(releaseId))
        );
    }
}