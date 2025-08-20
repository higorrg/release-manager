import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// This interface can be expanded based on the backend model
export interface Release {
  id: string;
  productName: string;
  version: string;
  currentStatus: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReleaseService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/v1/releases'; // Assuming a proxy is configured

  getReleases(): Observable<Release[]> {
    return this.http.get<Release[]>(this.apiUrl);
  }
}
