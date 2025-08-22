import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import Keycloak from 'keycloak-js';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private keycloak: Keycloak;
  private _isInitialized = signal(false);
  private _isAuthenticated = signal(false);
  private _user = signal<any>(null);

  isInitialized = this._isInitialized.asReadonly();
  isAuthenticated = this._isAuthenticated.asReadonly();
  user = this._user.asReadonly();

  constructor(private router: Router) {
    this.keycloak = new Keycloak({
      url: environment.keycloak.url,
      realm: environment.keycloak.realm,
      clientId: environment.keycloak.clientId
    });
  }

  async init(): Promise<void> {
    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html'
      });

      this._isAuthenticated.set(authenticated);
      this._isInitialized.set(true);

      if (authenticated) {
        this.loadUserProfile();
        this.setupTokenRefresh();
      } else {
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Failed to initialize Keycloak', error);
      this._isInitialized.set(true);
      this.router.navigate(['/login']);
    }
  }

  async login(): Promise<void> {
    try {
      await this.keycloak.login({
        redirectUri: window.location.origin + '/dashboard'
      });
    } catch (error) {
      console.error('Login failed', error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.keycloak.logout({
        redirectUri: window.location.origin
      });
      this._isAuthenticated.set(false);
      this._user.set(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  hasRole(role: string): boolean {
    return this.keycloak.hasRealmRole(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  private async loadUserProfile(): Promise<void> {
    try {
      const profile = await this.keycloak.loadUserProfile();
      this._user.set(profile);
    } catch (error) {
      console.error('Failed to load user profile', error);
    }
  }

  private setupTokenRefresh(): void {
    setInterval(async () => {
      try {
        await this.keycloak.updateToken(30);
      } catch (error) {
        console.error('Failed to refresh token', error);
        this.logout();
      }
    }, 60000);
  }
}