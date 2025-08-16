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
  private loading = signal(true);

  constructor(private router: Router) {}

  async init(): Promise<void> {
    console.log('AuthService init starting...');
    try {
      this.keycloak = new Keycloak({
        url: 'http://localhost:8080',
        realm: 'release-manager',
        clientId: 'release-manager-frontend'
      });

      console.log('Keycloak instance created, initializing...');
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        checkLoginIframe: false,
        enableLogging: true
      });

      console.log('Keycloak init completed, authenticated:', authenticated);
      this.authenticated.set(authenticated);

      if (authenticated) {
        console.log('User is authenticated, loading profile...');
        await this.loadUserProfile();
        this.setupTokenRefresh();
        
        // Handle redirect after authentication
        const redirectUrl = sessionStorage.getItem('redirectUrl');
        if (redirectUrl) {
          console.log('Redirecting to stored URL:', redirectUrl);
          sessionStorage.removeItem('redirectUrl');
          this.router.navigate([redirectUrl]);
        }
      } else {
        console.log('User is not authenticated');
      }
    } catch (error) {
      console.error('Failed to initialize Keycloak:', error);
    } finally {
      console.log('AuthService init completed, setting loading to false');
      this.loading.set(false);
    }
  }

  isAuthenticated() {
    return this.authenticated();
  }

  isLoading() {
    return this.loading();
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
      console.log('Login called, checking if already in progress...');
      
      // Avoid multiple login calls
      if (this.keycloak && this.keycloak.authenticated) {
        console.log('User is already authenticated, skipping login');
        return;
      }
      
      console.log('Starting Keycloak login...');
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
      // Use token info instead of making a separate API call to avoid CORS issues
      if (this.keycloak.tokenParsed) {
        const tokenInfo = this.keycloak.tokenParsed;
        const profile = {
          username: tokenInfo['preferred_username'],
          email: tokenInfo['email'],
          firstName: tokenInfo['given_name'],
          lastName: tokenInfo['family_name'],
          name: tokenInfo['name']
        };
        this.userProfile.set(profile);
        console.log('User profile loaded from token:', profile);
      }
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