import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
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
        <a *ngFor="let release of recentReleases" 
           [routerLink]="['/dashboard/releases', release.id]"
           class="release-item release-link" 
           style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #f0f0f0; text-decoration: none; color: inherit; border-radius: 6px; margin-bottom: 5px; transition: all 0.3s ease;"
           onmouseover="this.style.backgroundColor='#f8f9fa'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'; this.style.transform='translateY(-1px)'; this.style.cursor='pointer'"
           onmouseout="this.style.backgroundColor='transparent'; this.style.boxShadow='none'; this.style.transform='translateY(0)'">
          <div style="flex: 1;">
            <h4 style="margin: 0; color: #333; font-size: 16px; font-weight: 500;">{{ release.name }} <span style="color: #1890ff; font-size: 12px;">🔗</span></h4>
            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">ID: {{ release.id }} • Clique para ver detalhes</p>
          </div>
          <div style="text-align: right;">
            <span class="status-badge" 
                  [style.background-color]="getStatusColor(release.status)"
                  style="padding: 4px 12px; border-radius: 12px; color: white; font-size: 12px; font-weight: 500;">
              {{ getStatusText(release.status) }}
            </span>
          </div>
        </a>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions" style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
        <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">🚀 Ações Rápidas</h3>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button routerLink="/dashboard/new-release" 
                  style="background: #52c41a; color: white; border: none; padding: 12px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
            ➕ Nova Release
          </button>
          <button routerLink="/dashboard/releases" 
                  style="background: #1890ff; color: white; border: none; padding: 12px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
            📋 Ver Todas
          </button>
          <button routerLink="/dashboard/clients" 
                  style="background: #722ed1; color: white; border: none; padding: 12px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
            👥 Gerenciar Clientes
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .release-link {
      cursor: pointer !important;
    }
    
    .release-link:hover {
      background-color: #f8f9fa !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
      transform: translateY(-1px) !important;
    }
    
    .release-link:hover h4 {
      color: #1890ff !important;
    }
    
    .release-link:active {
      transform: translateY(0) !important;
    }
    
    .release-link:focus {
      outline: 2px solid #1890ff;
      outline-offset: 2px;
    }
  `]
})
export class DashboardHomeComponent implements OnInit {
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
    // Load dashboard data
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
}