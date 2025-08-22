import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

import { ReleaseService } from '@shared/services/release.service';
import { Release } from '@shared/models/release.model';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>new_releases</mat-icon>
              Total de Releases
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{ totalReleases() }}</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>check_circle</mat-icon>
              Disponíveis
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{ availableReleases() }}</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>pending</mat-icon>
              Em Teste
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{ testingReleases() }}</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>error</mat-icon>
              Com Problemas
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{ problematicReleases() }}</div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="recent-releases-card">
        <mat-card-header>
          <mat-card-title>Releases Recentes</mat-card-title>
          <div class="spacer"></div>
          <button mat-button color="primary" routerLink="/releases">
            Ver Todas
            <mat-icon>arrow_forward</mat-icon>
          </button>
        </mat-card-header>
        
        <mat-card-content>
          @if (loading()) {
            <div class="loading-container">
              <mat-spinner diameter="40"></mat-spinner>
            </div>
          } @else {
            <div class="releases-list">
              @for (release of recentReleases(); track release.id) {
                <div class="release-item">
                  <div class="release-info">
                    <div class="release-version">{{ release.version }}</div>
                    <div class="release-product">{{ release.productName }}</div>
                  </div>
                  <mat-chip 
                    [class]="'status-' + getStatusClass(release.status)"
                    color="primary">
                    {{ release.status }}
                  </mat-chip>
                </div>
              } @empty {
                <div class="empty-state">
                  <mat-icon>inbox</mat-icon>
                  <p>Nenhuma release encontrada</p>
                </div>
              }
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .stat-card {
      text-align: center;
    }

    .stat-card mat-card-header {
      justify-content: center;
    }

    .stat-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
    }

    .stat-number {
      font-size: 48px;
      font-weight: bold;
      color: #1976d2;
    }

    .recent-releases-card {
      min-height: 400px;
    }

    .recent-releases-card mat-card-header {
      display: flex;
      align-items: center;
    }

    .spacer {
      flex: 1;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 32px;
    }

    .releases-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .release-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }

    .release-info {
      display: flex;
      flex-direction: column;
    }

    .release-version {
      font-weight: 500;
      font-size: 16px;
    }

    .release-product {
      color: #666;
      font-size: 14px;
    }

    .empty-state {
      text-align: center;
      padding: 32px;
      color: #666;
    }

    .empty-state mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 16px;
    }

    /* Status colors */
    .status-disponivel {
      background-color: #4caf50 !important;
    }

    .status-controlada {
      background-color: #9c27b0 !important;
    }

    .status-mr-aprovado {
      background-color: #2196f3 !important;
    }

    .status-teste {
      background-color: #ff9800 !important;
    }

    .status-falha {
      background-color: #f44336 !important;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  private releaseService = inject(ReleaseService);

  loading = signal(true);
  recentReleases = signal<Release[]>([]);
  totalReleases = signal(0);
  availableReleases = signal(0);
  testingReleases = signal(0);
  problematicReleases = signal(0);

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    this.releaseService.getReleases({ size: 10 }).subscribe({
      next: (result) => {
        this.recentReleases.set(result.releases);
        this.totalReleases.set(result.totalElements);
        this.calculateStats(result.releases);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  private calculateStats(releases: Release[]) {
    const available = releases.filter(r => r.status === 'Disponível' || r.status === 'Controlada').length;
    const testing = releases.filter(r => r.status.includes('Teste')).length;
    const problematic = releases.filter(r => r.status.includes('Falha') || r.status === 'Reprovada no teste').length;

    this.availableReleases.set(available);
    this.testingReleases.set(testing);
    this.problematicReleases.set(problematic);
  }

  getStatusClass(status: string): string {
    if (status === 'Disponível') return 'disponivel';
    if (status === 'Controlada') return 'controlada';
    if (status === 'MR Aprovado') return 'mr-aprovado';
    if (status.includes('Teste')) return 'teste';
    if (status.includes('Falha')) return 'falha';
    return 'default';
  }
}