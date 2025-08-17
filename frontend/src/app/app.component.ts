import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { ConfirmationDialogComponent } from './shared/components/confirmation-dialog.component';
import { ConfirmationService } from './shared/services/confirmation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    @if (isLoading()) {
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    } @else if (isAuthenticated()) {
      <div class="app-container">
        <header class="app-header">
          <div class="header-content">
            <h1>Release Manager</h1>
            <nav class="nav-menu">
              <a routerLink="/releases" routerLinkActive="active">Releases</a>
              <a routerLink="/clients" routerLinkActive="active">Clientes</a>
            </nav>
            <div class="user-menu">
              <span class="user-name">{{ getUserName() }}</span>
              <button (click)="logout()" class="logout-btn">Sair</button>
            </div>
          </div>
        </header>
        
        <main class="main-content">
          <router-outlet />
        </main>
      </div>
      
      <!-- Global confirmation dialog -->
      @if (confirmationService.config()) {
        <app-confirmation-dialog
          [config]="confirmationService.config()!"
          [show]="confirmationService.show()"
          (confirmed)="confirmationService.onConfirmed()"
          (cancelled)="confirmationService.onCancelled()">
        </app-confirmation-dialog>
      }
    } @else {
      <div class="login-container">
        <div class="login-card">
          <h1>Release Manager</h1>
          <p>Sistema de Gerenciamento de Releases</p>
          <button (click)="login()" class="login-btn">
            Entrar com Azure AD
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-header {
      background: #2c3e50;
      color: white;
      padding: 0 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1200px;
      margin: 0 auto;
      height: 60px;
    }

    .app-header h1 {
      margin: 0;
      font-size: 1.5rem;
    }

    .nav-menu {
      display: flex;
      gap: 20px;
    }

    .nav-menu a {
      color: white;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .nav-menu a:hover,
    .nav-menu a.active {
      background-color: rgba(255,255,255,0.1);
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-name {
      font-size: 0.9rem;
    }

    .logout-btn {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background-color 0.3s;
    }

    .logout-btn:hover {
      background: #c0392b;
    }

    .main-content {
      flex: 1;
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }

    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .login-card {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      text-align: center;
      max-width: 400px;
      width: 100%;
    }

    .login-card h1 {
      color: #2c3e50;
      margin-bottom: 10px;
    }

    .login-card p {
      color: #7f8c8d;
      margin-bottom: 30px;
    }

    .login-btn {
      background: #3498db;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.3s;
      width: 100%;
    }

    .login-btn:hover {
      background: #2980b9;
    }

    .loading-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #f8f9fa;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e9ecef;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-container p {
      color: #6c757d;
      font-size: 1rem;
      margin: 0;
    }
  `],
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, ConfirmationDialogComponent]
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  public confirmationService = inject(ConfirmationService);

  constructor() {
    console.log('AppComponent constructor called');
  }

  ngOnInit() {
    console.log('AppComponent ngOnInit called');
    console.log('Initializing auth service...');
    this.authService.init().catch(err => {
      console.error('Auth service initialization failed:', err);
    });
  }

  isAuthenticated() {
    // const authenticated = this.authService.isAuthenticated();
    // console.log('isAuthenticated():', authenticated);
    // return authenticated;
      return this.authService.isAuthenticated();
  }

  isLoading() {
    // const loading = this.authService.isLoading();
    // console.log('isLoading():', loading);
    // return loading;
      return this.authService.isLoading();
  }

  getUserName() {
    return this.authService.getUserName();
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}
      