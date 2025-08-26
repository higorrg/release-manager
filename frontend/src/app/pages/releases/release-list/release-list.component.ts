import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReleaseService } from '../../../shared/services/release.service';
import { Release } from '../../../shared/models/release.model';

@Component({
  selector: 'app-release-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  template: `<div class="release-list-container" style="padding: 20px;">
    <div class="header" style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h2 style="margin: 0 0 10px 0; color: #333;">📋 Lista de Releases</h2>
      <p style="margin: 0; color: #666;">Gerencie todos os releases do sistema</p>
    </div>

    <div class="releases-grid" style="display: grid; gap: 20px;">
      <div *ngFor="let release of releases" 
           class="release-card" 
           style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div>
            <h3 style="margin: 0 0 10px 0; color: #333;">{{ release.product }} v{{ release.version }}</h3>
            <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Versão: {{ release.version }}</p>
            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Produto: {{ release.product }}</p>
          </div>
          <span class="status-badge" 
                [style.background-color]="getStatusColor(release.status)"
                style="padding: 4px 12px; border-radius: 12px; color: white; font-size: 12px; font-weight: 500;">
            {{ getStatusText(release.status) }}
          </span>
        </div>
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #f0f0f0;">
          <button [routerLink]="['/releases', release.id]" 
                  style="background: #1890ff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px; font-size: 12px;">
            👁️ Ver Detalhes
          </button>
          <button [routerLink]="['/releases', release.id, 'history']" 
                  style="background: #722ed1; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px; font-size: 12px;">
            📈 Histórico
          </button>
          <button [routerLink]="['/releases', release.id, 'clients']" 
                  style="background: #52c41a; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 12px;">
            👥 Clientes
          </button>
        </div>
      </div>
    </div>

    <div *ngIf="releases.length === 0" style="text-align: center; padding: 40px; background: white; border-radius: 8px; margin-top: 20px;">
      <h3 style="color: #666; margin-bottom: 20px;">Nenhum release encontrado</h3>
      <button style="background: #52c41a; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 14px;">
        ➕ Criar Primeiro Release
      </button>
    </div>
  </div>`
})
export class ReleaseListComponent implements OnInit {
  releases: Release[] = [];

  constructor(private releaseService: ReleaseService) {}

  ngOnInit(): void {
    this.loadReleases();
  }

  private loadReleases(): void {
    this.releaseService.getReleases().subscribe({
      next: (releases) => {
        this.releases = releases;
      },
      error: (error) => {
        console.error('Erro ao carregar releases:', error);
      }
    });
  }

  getStatusColor(status: string): string {
    return this.releaseService.getStatusColor(status as any);
  }

  getStatusText(status: string): string {
    return this.releaseService.getStatusText(status as any);
  }
}