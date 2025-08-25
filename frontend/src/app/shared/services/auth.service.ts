import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';

import { 
  User, 
  UserLoginRequest, 
  UserRegisterRequest, 
  AuthResponse, 
  UserProfile 
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/v1';
  private readonly TOKEN_KEY = 'release-manager-token';
  private readonly USER_KEY = 'release-manager-user';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Signals for reactive state management
  private isAuthenticatedSignal = signal<boolean>(false);
  private currentUserSignal = signal<User | null>(null);
  private isLoadingSignal = signal<boolean>(false);

  // Computed signals
  public isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  public currentUser = this.currentUserSignal.asReadonly();
  public isLoading = this.isLoadingSignal.asReadonly();
  public userRole = computed(() => this.currentUserSignal()?.role);
  public userName = computed(() => this.currentUserSignal()?.name);

  constructor(
    private http: HttpClient,
    private router: Router,
    private message: NzMessageService
  ) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const token = this.getToken();
    const user = this.getStoredUser();
    
    if (token && user) {
      this.setAuthState(user, token);
    }
  }

  private setAuthState(user: User, token: string): void {
    this.currentUserSignal.set(user);
    this.currentUserSubject.next(user);
    this.isAuthenticatedSignal.set(true);
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private clearAuthState(): void {
    this.currentUserSignal.set(null);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSignal.set(false);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  login(credentials: UserLoginRequest): Observable<AuthResponse> {
    this.isLoadingSignal.set(true);
    
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.setAuthState(response.user, response.token);
          this.message.success('Login realizado com sucesso!');
          this.router.navigate(['/dashboard']);
        }),
        catchError(error => {
          this.message.error('Erro ao fazer login. Verifique suas credenciais.');
          return throwError(() => error);
        }),
        tap(() => this.isLoadingSignal.set(false))
      );
  }

  register(userData: UserRegisterRequest): Observable<AuthResponse> {
    this.isLoadingSignal.set(true);
    
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/register`, userData)
      .pipe(
        tap(response => {
          this.message.success('Cadastro realizado com sucesso! Faça login para continuar.');
          this.router.navigate(['/auth/login']);
        }),
        catchError(error => {
          this.message.error('Erro ao realizar cadastro. Tente novamente.');
          return throwError(() => error);
        }),
        tap(() => this.isLoadingSignal.set(false))
      );
  }

  logout(): void {
    this.clearAuthState();
    this.message.info('Você foi deslogado com sucesso.');
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getStoredUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  refreshUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.API_URL}/auth/profile`)
      .pipe(
        tap(profile => {
          const updatedUser: User = {
            ...this.currentUserSignal()!,
            ...profile
          };
          this.setAuthState(updatedUser, this.getToken()!);
        }),
        catchError(error => {
          this.message.error('Erro ao atualizar perfil do usuário.');
          return throwError(() => error);
        })
      );
  }

  updateProfile(profileData: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.API_URL}/auth/profile`, profileData)
      .pipe(
        tap(profile => {
          const updatedUser: User = {
            ...this.currentUserSignal()!,
            ...profile
          };
          this.setAuthState(updatedUser, this.getToken()!);
          this.message.success('Perfil atualizado com sucesso!');
        }),
        catchError(error => {
          this.message.error('Erro ao atualizar perfil.');
          return throwError(() => error);
        })
      );
  }

  changePassword(oldPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/auth/change-password`, {
      oldPassword,
      newPassword
    }).pipe(
      tap(() => {
        this.message.success('Senha alterada com sucesso!');
      }),
      catchError(error => {
        this.message.error('Erro ao alterar senha. Verifique a senha atual.');
        return throwError(() => error);
      })
    );
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return tokenPayload.exp < currentTime;
    } catch {
      return true;
    }
  }

  hasRole(role: string): boolean {
    const userRole = this.userRole();
    return userRole === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const userRole = this.userRole();
    return roles.includes(userRole || '');
  }
}