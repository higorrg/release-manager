import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  template: `<div class="dashboard-container" style="min-height: 100vh; background: #f5f5f5; padding: 20px;">
    <!-- Header -->
    <div class="dashboard-header" style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1 style="margin: 0; color: #333; font-size: 24px;">🚀 Release Manager</h1>
          <p style="margin: 5px 0 0 0; color: #666;">{{ getGreeting() }}, {{ currentUser.name }}!</p>
        </div>
        <button (click)="logout()" 
                style="background: #ff4757; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px;">
          🚪 Sair
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
      <div class="stat-card" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 32px; color: #1890ff; margin-bottom: 10px;">📊</div>
        <h3 style="margin: 0; font-size: 24px; color: #333;">{{ stats.totalReleases }}</h3>
        <p style="margin: 5px 0 0 0; color: #666;">Total de Releases</p>
      </div>

      <div class="stat-card" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 32px; color: #52c41a; margin-bottom: 10px;">⚡</div>
        <h3 style="margin: 0; font-size: 24px; color: #333;">{{ stats.activeReleases }}</h3>
        <p style="margin: 5px 0 0 0; color: #666;">Releases Ativas</p>
      </div>

      <div class="stat-card" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 32px; color: #722ed1; margin-bottom: 10px;">✅</div>
        <h3 style="margin: 0; font-size: 24px; color: #333;">{{ stats.completedThisMonth }}</h3>
        <p style="margin: 5px 0 0 0; color: #666;">Concluídas Este Mês</p>
      </div>

      <div class="stat-card" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 32px; color: #fa8c16; margin-bottom: 10px;">⏳</div>
        <h3 style="margin: 0; font-size: 24px; color: #333;">{{ stats.pendingReleases }}</h3>
        <p style="margin: 5px 0 0 0; color: #666;">Pendentes</p>
      </div>
    </div>

    <!-- Recent Releases -->
    <div class="recent-releases" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h2 style="margin: 0 0 20px 0; color: #333; font-size: 18px;">📋 Releases Recentes</h2>
      
      <div class="releases-list">
        <div *ngFor="let release of recentReleases" 
             class="release-item" 
             style="display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid #f0f0f0;">
          <div>
            <h4 style="margin: 0; color: #333; font-size: 16px;">{{ release.name }}</h4>
            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">ID: {{ release.id }}</p>
          </div>
          <div style="text-align: right;">
            <span class="status-badge" 
                  [style.background-color]="getStatusColor(release.status)"
                  style="padding: 4px 12px; border-radius: 12px; color: white; font-size: 12px; font-weight: 500;">
              {{ getStatusText(release.status) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons" style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #f0f0f0; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
        <button routerLink="/dashboard/releases" 
                style="background: #1890ff; color: white; border: none; padding: 12px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
          📋 Releases
        </button>
        <button routerLink="/dashboard/clients" 
                style="background: #722ed1; color: white; border: none; padding: 12px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
          👥 Clientes
        </button>
        <button routerLink="/dashboard/pipeline" 
                style="background: #fa8c16; color: white; border: none; padding: 12px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
          🔗 Pipeline
        </button>
        <button routerLink="/dashboard/api" 
                style="background: #13c2c2; color: white; border: none; padding: 12px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
          🔌 API Docs
        </button>
        <button style="background: #52c41a; color: white; border: none; padding: 12px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
          ➕ Nova Release
        </button>
      </div>
    </div>

    <!-- Router Outlet for Child Routes -->
    <div class="content-area" style="margin-top: 20px;">
      <router-outlet></router-outlet>
    </div>
  </div>`
})
export class DashboardComponent implements OnInit {
  currentUser = { name: 'Administrador' };
  
  stats = {
    totalReleases: 12,
    activeReleases: 3,
    completedThisMonth: 8,
    pendingReleases: 1
  };

  recentReleases = [
    { id: 1, name: 'Release 1.2.3', status: 'IN_PROGRESS', createdAt: new Date() },
    { id: 2, name: 'Release 1.2.2', status: 'COMPLETED', createdAt: new Date() },
    { id: 3, name: 'Release 1.2.1', status: 'TESTING', createdAt: new Date() }
  ];

  constructor() {}

  ngOnInit(): void {
    // Dashboard initialization
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'COMPLETED': return '#52c41a';
      case 'IN_PROGRESS': return '#1890ff';
      case 'TESTING': return '#fa8c16';
      case 'PENDING': return '#d9d9d9';
      default: return '#d9d9d9';
    }
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'COMPLETED': return 'Concluído';
      case 'IN_PROGRESS': return 'Em Progresso';
      case 'TESTING': return 'Em Teste';
      case 'PENDING': return 'Pendente';
      default: return 'Desconhecido';
    }
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    else if (hour < 18) return 'Boa tarde';
    else return 'Boa noite';
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  }
}