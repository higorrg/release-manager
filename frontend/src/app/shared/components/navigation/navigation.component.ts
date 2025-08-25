import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navigation-container">
      <!-- Header com título e botão sair -->
      <div class="nav-header">
        <div class="nav-title">
          <h1>🚀 Release Manager</h1>
          <p>{{ getGreeting() }}, {{ currentUser.name }}!</p>
        </div>
        <button (click)="logout()" class="logout-btn">
          🚪 Sair
        </button>
      </div>

      <!-- Menu de navegação -->
      <div class="nav-menu">
        <button 
          *ngFor="let item of menuItems" 
          [routerLink]="item.route"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
          class="nav-item">
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .navigation-container {
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }

    .nav-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #f0f0f0;
    }

    .nav-title h1 {
      margin: 0;
      color: #333;
      font-size: 24px;
    }

    .nav-title p {
      margin: 5px 0 0 0;
      color: #666;
      font-size: 14px;
    }

    .logout-btn {
      background: #ff4757;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s;
    }

    .logout-btn:hover {
      background: #ff3742;
    }

    .nav-menu {
      display: flex;
      padding: 0 20px;
      overflow-x: auto;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 8px;
      background: none;
      border: none;
      padding: 16px 20px;
      cursor: pointer;
      color: #666;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      border-bottom: 3px solid transparent;
      transition: all 0.3s;
      white-space: nowrap;
    }

    .nav-item:hover {
      color: #1890ff;
      background: rgba(24, 144, 255, 0.1);
    }

    .nav-item.active {
      color: #1890ff;
      border-bottom-color: #1890ff;
      background: rgba(24, 144, 255, 0.1);
    }

    .nav-icon {
      font-size: 16px;
    }

    @media (max-width: 768px) {
      .nav-header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }
      
      .nav-menu {
        justify-content: center;
        flex-wrap: wrap;
        gap: 5px;
      }
      
      .nav-item {
        padding: 12px 16px;
        font-size: 13px;
      }
    }
  `]
})
export class NavigationComponent {
  currentUser = { name: 'Administrador' };

  menuItems = [
    { label: 'Home', route: '/dashboard', icon: '🏠' },
    { label: 'Releases', route: '/dashboard/releases', icon: '📋' },
    { label: 'Clientes', route: '/dashboard/clients', icon: '👥' },
    { label: 'Pipeline', route: '/dashboard/pipeline', icon: '🔗' },
    { label: 'API Docs', route: '/dashboard/api', icon: '🔌' },
    { label: 'Nova Release', route: '/dashboard/new-release', icon: '➕' }
  ];

  constructor(private router: Router) {}

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    else if (hour < 18) return 'Boa tarde';
    else return 'Boa noite';
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }
}