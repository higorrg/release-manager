import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api/api.service';
import { Client, CreateClientRequest, UpdateClientRequest } from '../models/client.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private api = inject(ApiService);

  getAllClients(activeOnly: boolean = true): Observable<Client[]> {
    const params = new HttpParams().set('active', activeOnly.toString());
    return this.api.get<Client[]>('/api/clients', params);
  }

  getClientByCode(clientCode: string): Observable<Client> {
    return this.api.get<Client>(`/api/clients/${clientCode}`);
  }

  getBetaPartners(): Observable<Client[]> {
    return this.api.get<Client[]>('/api/clients/beta-partners');
  }

  createClient(request: CreateClientRequest): Observable<Client> {
    return this.api.post<Client>('/api/clients', request);
  }

  updateClient(clientCode: string, request: UpdateClientRequest): Observable<void> {
    return this.api.put<void>(`/api/clients/${clientCode}`, request);
  }

  activateClient(clientCode: string): Observable<void> {
    return this.api.put<void>(`/api/clients/${clientCode}/activate`, {});
  }

  deactivateClient(clientCode: string): Observable<void> {
    return this.api.put<void>(`/api/clients/${clientCode}/deactivate`, {});
  }
}