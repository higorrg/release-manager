import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Client {
    id: string;
    clientCode: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface Environment {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
}

export interface ReleaseClientEnvironment {
    id: string;
    releaseId: string;
    clientId: string;
    environmentId: string;
    createdAt: string;
}

export interface ControlledClientDetail {
    id: string;
    releaseId: string;
    clientId: string;
    clientCode: string;
    clientName: string;
    clientDescription?: string;
    environmentId: string;
    environmentName: string;
    environmentDescription?: string;
    createdAt: string;
}

export interface AddControlledClientRequest {
    clientCode: string;
    environment: string;
}

@Injectable({
    providedIn: 'root'
})
export class ClientService {
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

    // Get all clients
    getAllClients(): Observable<Client[]> {
        return this.http.get<Client[]>(`${this.apiUrl}/clients`, {
            headers: this.getHeaders()
        });
    }

    // Get all environments
    getAllEnvironments(): Observable<Environment[]> {
        return this.http.get<Environment[]>(`${this.apiUrl}/environments`, {
            headers: this.getHeaders()
        });
    }

    // Get controlled clients for a specific release with full details
    getControlledClients(releaseId: string): Observable<ControlledClientDetail[]> {
        return this.http.get<ControlledClientDetail[]>(`${this.apiUrl}/${releaseId}/controlled-clients`, {
            headers: this.getHeaders()
        });
    }

    // Add controlled client to a release
    addControlledClient(releaseId: string, request: AddControlledClientRequest): Observable<ControlledClientDetail> {
        return this.http.post<ControlledClientDetail>(`${this.apiUrl}/${releaseId}/controlled-clients`, request, {
            headers: this.getHeaders()
        });
    }

    // Remove controlled client from a release
    removeControlledClient(releaseId: string, clientId: string, environmentId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${releaseId}/controlled-clients/${clientId}/environments/${environmentId}`, {
            headers: this.getHeaders()
        });
    }
}