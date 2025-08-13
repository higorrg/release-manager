import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  template: `
    @if (isAuthenticated()) {
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
  `],
  imports: [RouterOutlet, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.authService.init();
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
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
      