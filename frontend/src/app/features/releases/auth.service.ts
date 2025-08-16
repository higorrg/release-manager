import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  roles: string[];
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  // State management with signals
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // Token management
  private accessToken = signal<string | null>(null);
  private refreshToken = signal<string | null>(null);
  private tokenExpiry = signal<number | null>(null);
  
  // Computed values
  public isAuthenticated = computed(() => {
    const token = this.accessToken();
    const expiry = this.tokenExpiry();
    
    if (!token || !expiry) return false;
    
    // Check if token is expired
    return Date.now() < expiry;
  });
  
  public user = computed(() => this.currentUserSubject.value);
  
  // Keycloak configuration
  private keycloakConfig = {
    url: environment.keycloakUrl || 'http://localhost:8080',
    realm: environment.keycloakRealm || 'release-manager',
    clientId: environment.keycloakClientId || 'release-manager-app',
    redirectUri: environment.keycloakRedirectUri || window.location.origin + '/callback'
  };

  constructor() {
    this.loadStoredTokens();
    this.checkTokenExpiry();
  }

  /**
   * Initiates the SSO login flow with Keycloak
   */
  login(): void {
    const params = new URLSearchParams({
      client_id: this.keycloakConfig.clientId,
      redirect_uri: this.keycloakConfig.redirectUri,
      response_type: 'code',
      scope: 'openid profile email',
      state: this.generateState()
    });

    const authUrl = `${this.keycloakConfig.url}/realms/${this.keycloakConfig.realm}/protocol/openid-connect/auth?${params}`;
    
    // Store current route to redirect back after login
    sessionStorage.setItem('redirectUrl', this.router.url);
    
    // Redirect to Keycloak login page
    window.location.href = authUrl;
  }

  /**
   * Handles the callback from Keycloak after login
   */
  handleCallback(code: string, state: string): Observable<boolean> {
    // Verify state to prevent CSRF attacks
    const storedState = sessionStorage.getItem('oauth_state');
    if (state !== storedState) {
      return throwError(() => new Error('Invalid state parameter'));
    }

    // Exchange authorization code for tokens
    return this.exchangeCodeForTokens(code).pipe(
      tap(tokens => {
        this.storeTokens(tokens);
        this.loadUserInfo();
      }),
      map(() => true),
      catchError(error => {
        console.error('Error during token exchange:', error);
        return of(false);
      })
    );
  }

  /**
   * Exchanges authorization code for access and refresh tokens
   */
  private exchangeCodeForTokens(code: string): Observable<AuthTokens> {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      client_id: this.keycloakConfig.clientId,
      redirect_uri: this.keycloakConfig.redirectUri
    });

    return this.http.post<AuthTokens>(
      `${this.keycloakConfig.url}/realms/${this.keycloakConfig.realm}/protocol/openid-connect/token`,
      body.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
  }

  /**
   * Refreshes the access token using the refresh token
   */
  refreshAccessToken(): Observable<AuthTokens> {
    const refresh = this.refreshToken();
    if (!refresh) {
      return throwError(() => new Error('No refresh token available'));
    }

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh,
      client_id: this.keycloakConfig.clientId
    });

    return this.http.post<AuthTokens>(
      `${this.keycloakConfig.url}/realms/${this.keycloakConfig.realm}/protocol/openid-connect/token`,
      body.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    ).pipe(
      tap(tokens => this.storeTokens(tokens)),
      catchError(error => {
        console.error('Error refreshing token:', error);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  /**
   * Loads user information from Keycloak
   */
  private loadUserInfo(): void {
    const token = this.accessToken();
    if (!token) return;

    this.http.get<any>(
      `${this.keycloakConfig.url}/realms/${this.keycloakConfig.realm}/protocol/openid-connect/userinfo`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).subscribe({
      next: (userInfo) => {
        const user: User = {
          id: userInfo.sub,
          username: userInfo.preferred_username || userInfo.sub,
          email: userInfo.email,
          name: userInfo.name || userInfo.preferred_username,
          roles: userInfo.realm_access?.roles || []
        };
        this.currentUserSubject.next(user);
      },
      error: (error) => {
        console.error('Error loading user info:', error);
      }
    });
  }

  /**
   * Logs out the user
   */
  logout(): void {
    const token = this.refreshToken();
    
    // Clear stored tokens and user info
    this.clearTokens();
    this.currentUserSubject.next(null);

    // Redirect to Keycloak logout endpoint
    if (token) {
      const params = new URLSearchParams({
        client_id: this.keycloakConfig.clientId,
        refresh_token: token,
        post_logout_redirect_uri: window.location.origin
      });

      const logoutUrl = `${this.keycloakConfig.url}/realms/${this.keycloakConfig.realm}/protocol/openid-connect/logout?${params}`;
      window.location.href = logoutUrl;
    } else {
      this.router.navigate(['/login']);
    }
  }

  /**
   * Gets the current access token
   */
  getAccessToken(): string | null {
    // Check if token needs refresh
    const expiry = this.tokenExpiry();
    if (expiry && Date.now() > expiry - 60000) { // Refresh 1 minute before expiry
      this.refreshAccessToken().subscribe();
    }
    
    return this.accessToken();
  }

  /**
   * Checks if user has a specific role
   */
  hasRole(role: string): boolean {
    const user = this.user();
    return user ? user.roles.includes(role) : false;
  }

  /**
   * Stores tokens in memory and localStorage
   */
  private storeTokens(tokens: AuthTokens): void {
    this.accessToken.set(tokens.access_token);
    this.refreshToken.set(tokens.refresh_token);
    
    const expiry = Date.now() + (tokens.expires_in * 1000);
    this.tokenExpiry.set(expiry);
    
    // Store in localStorage for persistence
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
    localStorage.setItem('token_expiry', expiry.toString());
  }

  /**
   * Loads tokens from localStorage on app initialization
   */
  private loadStoredTokens(): void {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const tokenExpiry = localStorage.getItem('token_expiry');
    
    if (accessToken && refreshToken && tokenExpiry) {
      this.accessToken.set(accessToken);
      this.refreshToken.set(refreshToken);
      this.tokenExpiry.set(parseInt(tokenExpiry, 10));
      
      // Load user info if token is valid
      if (this.isAuthenticated()) {
        this.loadUserInfo();
      } else {
        // Try to refresh if we have a refresh token
        this.refreshAccessToken().subscribe();
      }
    }
  }

  /**
   * Clears all stored tokens
   */
  private clearTokens(): void {
    this.accessToken.set(null);
    this.refreshToken.set(null);
    this.tokenExpiry.set(null);
    
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expiry');
    sessionStorage.removeItem('oauth_state');
    sessionStorage.removeItem('redirectUrl');
  }

  /**
   * Generates a random state parameter for OAuth
   */
  private generateState(): string {
    const state = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('oauth_state', state);
    return state;
  }

  /**
   * Periodically checks token expiry
   */
  private checkTokenExpiry(): void {
    setInterval(() => {
      const expiry = this.tokenExpiry();
      if (expiry && Date.now() > expiry - 120000) { // 2 minutes before expiry
        this.refreshAccessToken().subscribe();
      }
    }, 60000); // Check every minute
  }
}