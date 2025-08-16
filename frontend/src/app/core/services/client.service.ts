import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../features/releases/auth.service';

export interface Client {
    id: string;
    clientCode: string;
    environment: 'homologacao' | 'producao';
    releaseId: string;
    releaseProduct: string;
    releaseVersion: string;
    releaseStatus: string;
    createdAt: string;
    updatedAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class ClientService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private readonly apiUrl = 'http://localhost:8081/api/v1/controlled-clients';

    private getHeaders(): HttpHeaders {
        const token = this.authService.getAccessToken();
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

    getAllControlledClients(): Observable<Client[]> {
        return this.http.get<Client[]>(`${this.apiUrl}`, {
            headers: this.getHeaders()
        });
    }

    getControlledClientsByEnvironment(environment: string): Observable<Client[]> {
        return this.http.get<Client[]>(`${this.apiUrl}?environment=${environment}`, {
            headers: this.getHeaders()
        });
    }

    searchControlledClients(query: string): Observable<Client[]> {
        return this.http.get<Client[]>(`${this.apiUrl}?search=${query}`, {
            headers: this.getHeaders()
        });
    }
}