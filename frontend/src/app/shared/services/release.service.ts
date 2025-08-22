import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { 
  Release, 
  ReleasesResult, 
  CreateReleaseRequest, 
  UpdateStatusRequest,
  StatusOption,
  ClientEnvironment,
  AddClientEnvironmentRequest,
  HistoryEntry
} from '@shared/models/release.model';

@Injectable({
  providedIn: 'root'
})
export class ReleaseService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/v1/releases`;

  getReleases(params?: {
    productName?: string;
    version?: string;
    status?: string;
    page?: number;
    size?: number;
  }): Observable<ReleasesResult> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ReleasesResult>(this.baseUrl, { params: httpParams });
  }

  getReleaseById(id: number): Observable<Release> {
    return this.http.get<Release>(`${this.baseUrl}/${id}`);
  }

  createRelease(request: CreateReleaseRequest): Observable<Release> {
    return this.http.post<Release>(this.baseUrl, request);
  }

  updateStatus(id: number, request: UpdateStatusRequest): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/status`, request);
  }

  getStatusOptions(): Observable<StatusOption[]> {
    return this.http.get<StatusOption[]>(`${this.baseUrl}/status-options`);
  }

  getClientEnvironments(releaseId: number): Observable<ClientEnvironment[]> {
    return this.http.get<ClientEnvironment[]>(`${this.baseUrl}/${releaseId}/client-environments`);
  }

  addClientEnvironment(releaseId: number, request: AddClientEnvironmentRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${releaseId}/client-environments`, request);
  }

  removeClientEnvironment(releaseId: number, request: AddClientEnvironmentRequest): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${releaseId}/client-environments`, { body: request });
  }

  getReleaseHistory(releaseId: number): Observable<HistoryEntry[]> {
    return this.http.get<HistoryEntry[]>(`${environment.apiUrl}/v1/audit/releases/${releaseId}/history`);
  }
}