import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Client, CreateClientRequest, UpdateClientRequest } from '@shared/models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/v1/clients`;

  getClients(activeOnly?: boolean): Observable<Client[]> {
    let params = new HttpParams();
    if (activeOnly !== undefined) {
      params = params.set('active', activeOnly.toString());
    }
    return this.http.get<Client[]>(this.baseUrl, { params });
  }

  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/${id}`);
  }

  getClientByCode(code: string): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/code/${code}`);
  }

  createClient(request: CreateClientRequest): Observable<Client> {
    return this.http.post<Client>(this.baseUrl, request);
  }

  updateClient(id: number, request: UpdateClientRequest): Observable<Client> {
    return this.http.put<Client>(`${this.baseUrl}/${id}`, request);
  }
}