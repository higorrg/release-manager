import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api/api.service';
import { 
  Release, 
  CreateReleaseRequest, 
  UpdateStatusRequest, 
  AddClientRequest,
  ReleaseStatus,
  Environment 
} from '../models/release.model';

@Injectable({
  providedIn: 'root'
})
export class ReleaseService {
  private api = inject(ApiService);

  getAllReleases(): Observable<Release[]> {
    return this.api.get<Release[]>('/api/releases');
  }

  getReleasesByProduct(productName: string): Observable<Release[]> {
    return this.api.get<Release[]>(`/api/releases/product/${productName}`);
  }

  getReleaseByProductAndVersion(productName: string, version: string): Observable<Release> {
    return this.api.get<Release>(`/api/releases/product/${productName}/version/${version}`);
  }

  getReleasesByStatus(status: ReleaseStatus): Observable<Release[]> {
    return this.api.get<Release[]>(`/api/releases/status/${status}`);
  }

  createRelease(request: CreateReleaseRequest): Observable<Release> {
    return this.api.post<Release>('/api/releases', request);
  }

  updateReleaseStatus(releaseId: number, request: UpdateStatusRequest): Observable<void> {
    return this.api.put<void>(`/api/releases/${releaseId}/status`, request);
  }

  addClientToRelease(releaseId: number, request: AddClientRequest): Observable<void> {
    return this.api.post<void>(`/api/releases/${releaseId}/clients`, request);
  }

  removeClientFromRelease(releaseId: number, clientCode: string, environment: Environment): Observable<void> {
    return this.api.delete<void>(`/api/releases/${releaseId}/clients/${clientCode}/environments/${environment}`);
  }
}