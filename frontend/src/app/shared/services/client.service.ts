import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  Client,
  CreateClientRequest,
  UpdateClientRequest
} from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly API_URL = 'http://localhost:8081/api/v1';

  constructor(private http: HttpClient) {}

  // GET all clients
  getClients(active?: boolean): Observable<Client[]> {
    let params = new HttpParams();
    if (active !== undefined) {
      params = params.set('active', active.toString());
    }

    return this.http.get<Client[]>(`${this.API_URL}/clients`, { params })
      .pipe(
        catchError(error => {
          console.error('Erro ao carregar clientes:', error);
          return throwError(() => error);
        })
      );
  }

  // GET client by ID
  getClientById(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.API_URL}/clients/${id}`)
      .pipe(
        catchError(error => {
          console.error('Erro ao carregar cliente:', error);
          return throwError(() => error);
        })
      );
  }

  // GET client by code
  getClientByCode(code: string): Observable<Client> {
    return this.http.get<Client>(`${this.API_URL}/clients/code/${code}`)
      .pipe(
        catchError(error => {
          console.error('Erro ao carregar cliente por código:', error);
          return throwError(() => error);
        })
      );
  }

  // CREATE new client
  createClient(clientData: CreateClientRequest): Observable<Client> {
    return this.http.post<Client>(`${this.API_URL}/clients`, clientData)
      .pipe(
        catchError(error => {
          console.error('Erro ao criar cliente:', error);
          return throwError(() => error);
        })
      );
  }

  // UPDATE client
  updateClient(id: string, updateData: UpdateClientRequest): Observable<Client> {
    return this.http.put<Client>(`${this.API_URL}/clients/${id}`, updateData)
      .pipe(
        catchError(error => {
          console.error('Erro ao atualizar cliente:', error);
          return throwError(() => error);
        })
      );
  }

  // DELETE client
  deleteClient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/clients/${id}`)
      .pipe(
        catchError(error => {
          console.error('Erro ao excluir cliente:', error);
          return throwError(() => error);
        })
      );
  }
}