import { Injectable, signal } from '@angular/core';
import Keycloak from 'keycloak-js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private keycloak!: Keycloak;
  private authenticated = signal(false);
  private userProfile = signal<any>(null);

  constructor(private router: Router) {}

  async init(): Promise<void> {
    try {
      this.keycloak = new Keycloak({
        url: 'http://localhost:8080',
        realm: 'release-manager',
        clientId: 'release-manager-frontend'
      });

      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        checkLoginIframe: false
      });

      this.authenticated.set(authenticated);

      if (authenticated) {
        await this.loadUserProfile();
        this.setupTokenRefresh();
      }
    } catch (error) {
      console.error('Failed to initialize Keycloak:', error);
    }
  }

  isAuthenticated() {
    return this.authenticated();
  }

  getUserName(): string {
    const profile = this.userProfile();
    return profile?.firstName && profile?.lastName 
      ? `${profile.firstName} ${profile.lastName}`
      : profile?.username || 'Usuário';
  }

  getUserEmail(): string {
    return this.userProfile()?.email || '';
  }

  getToken(): string | undefined {
    return this.keycloak?.token;
  }

  hasRole(role: string): boolean {
    return this.keycloak?.hasRealmRole(role) || false;
  }

  async login(): Promise<void> {
    try {
      await this.keycloak.login({
        redirectUri: window.location.origin
      });
    } catch (error) {
      console.error('Failed to login:', error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.keycloak.logout({
        redirectUri: window.location.origin
      });
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }

  private async loadUserProfile(): Promise<void> {
    try {
      const profile = await this.keycloak.loadUserProfile();
      this.userProfile.set(profile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  }

  private setupTokenRefresh(): void {
    // Refresh token when it's about to expire (30 seconds before)
    setInterval(async () => {
      try {
        const refreshed = await this.keycloak.updateToken(30);
        if (refreshed) {
          console.log('Token refreshed');
        }
      } catch (error) {
        console.error('Failed to refresh token:', error);
        this.authenticated.set(false);
        this.router.navigate(['/']);
      }
    }, 30000); // Check every 30 seconds
  }
}