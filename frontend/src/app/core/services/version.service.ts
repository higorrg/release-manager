import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AvailableVersion } from '../models/available-version.model';

@Injectable({
    providedIn: 'root'
})
export class VersionService {
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

    getAvailableVersions(clientCode: string, environment: string): Observable<AvailableVersion[]> {
        const params = new URLSearchParams({
            clientCode,
            environment
        });
        
        return this.http.get<AvailableVersion[]>(
            `${this.apiUrl}/available-versions?${params}`,
            { headers: this.getHeaders() }
        );
    }
}