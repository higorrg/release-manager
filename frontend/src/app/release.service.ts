import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Release { id: string; productName: string; version: string; status: string; }

@Injectable({ providedIn: 'root' })
export class ReleaseService {
  #http = inject(HttpClient);

  listAvailable(clientCode: string, environment: string): Observable<Release[]> {
    return this.#http.get<Release[]>('/api/releases/available', { params: { clientCode, environment } });
  }

  updateStatus(id: string, status: string): Observable<void> {
    return this.#http.put<void>(`/api/releases/${id}/status`, { status });
  }

  addClient(id: string, clientCode: string, environment: string): Observable<void> {
    return this.#http.post<void>(`/api/releases/${id}/clients`, { clientCode, environment });
  }
}
