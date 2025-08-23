import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { Release, ReleaseStatus, STATUS_DESCRIPTIONS } from '../../shared/models/release.model';
import { ReleaseService } from '../../shared/services/release.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NzGridModule,
    NzCardModule,
    NzStatisticModule,
    NzTableModule,
    NzTagModule,
    NzIconModule,
    NzButtonModule
  ],
  template: `
    <div class="page-header">
      <h1>Dashboard</h1>
    </div>
    
    <div class="content-container">
      <!-- Statistics Cards -->
      <div nz-row [nzGutter]="16" class="mb-24">
        <div nz-col nzXs="24" nzSm="12" nzMd="6">
          <nz-card>
            <nz-statistic 
              [nzValue]="totalReleases()" 
              nzTitle="Total de Releases"
              [nzPrefix]="iconTemplate"
              [nzValueStyle]="{ color: '#1890ff' }">
            </nz-statistic>
            <ng-template #iconTemplate>
              <span nz-icon nzType="deployment-unit"></span>
            </ng-template>
          </nz-card>
        </div>
        
        <div nz-col nzXs="24" nzSm="12" nzMd="6">
          <nz-card>
            <nz-statistic 
              [nzValue]="availableReleases()" 
              nzTitle="Disponíveis"
              [nzValueStyle]="{ color: '#52c41a' }">
            </nz-statistic>
          </nz-card>
        </div>
        
        <div nz-col nzXs="24" nzSm="12" nzMd="6">
          <nz-card>
            <nz-statistic 
              [nzValue]="inTestingReleases()" 
              nzTitle="Em Teste"
              [nzValueStyle]="{ color: '#fa8c16' }">
            </nz-statistic>
          </nz-card>
        </div>
        
        <div nz-col nzXs="24" nzSm="12" nzMd="6">
          <nz-card>
            <nz-statistic 
              [nzValue]="failedReleases()" 
              nzTitle="Com Falhas"
              [nzValueStyle]="{ color: '#f5222d' }">
            </nz-statistic>
          </nz-card>
        </div>
      </div>
      
      <!-- Recent Releases -->
      <nz-card nzTitle="Releases Recentes">
        <nz-table 
          #basicTable 
          [nzData]="recentReleases()"
          [nzLoading]="loading()"
          nzSize="small">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Versão</th>
              <th>Status</th>
              <th>Atualizado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let release of basicTable.data">
              <td>{{ release.productName }}</td>
              <td>
                <nz-tag [nzColor]="getVersionTypeColor(release.versionType)">
                  {{ release.version }}
                </nz-tag>
              </td>
              <td>
                <nz-tag [nzColor]="getStatusColor(release.status)">
                  {{ getStatusDescription(release.status) }}
                </nz-tag>
              </td>
              <td>{{ release.updatedAt | date:'dd/MM/yyyy HH:mm' }}</td>
              <td>
                <button 
                  nz-button 
                  nzSize="small" 
                  nzType="link"
                  (click)="viewRelease(release)">
                  Ver Detalhes
                </button>
              </td>
            </tr>
          </tbody>
        </nz-table>
      </nz-card>
    </div>
  `,
  styles: [`
    .content-container {
      padding: 0 24px;
    }
    
    nz-card {
      margin-bottom: 16px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private releaseService = inject(ReleaseService);
  
  releases = signal<Release[]>([]);
  loading = signal(false);
  
  // Computed values
  totalReleases = computed(() => this.releases().length);
  
  availableReleases = computed(() => 
    this.releases().filter(r => 
      r.status === ReleaseStatus.DISPONIVEL || 
      r.status === ReleaseStatus.CONTROLADA
    ).length
  );
  
  inTestingReleases = computed(() =>
    this.releases().filter(r => 
      r.status === ReleaseStatus.EM_TESTE_SISTEMA ||
      r.status === ReleaseStatus.EM_TESTE_REGRESSIVO
    ).length
  );
  
  failedReleases = computed(() =>
    this.releases().filter(r => 
      r.status === ReleaseStatus.FALHA_BUILD_TESTE ||
      r.status === ReleaseStatus.FALHA_BUILD_PRODUCAO ||
      r.status === ReleaseStatus.REPROVADA_TESTE ||
      r.status === ReleaseStatus.REPROVADA_TESTE_REGRESSIVO ||
      r.status === ReleaseStatus.REVOGADA
    ).length
  );
  
  recentReleases = computed(() => 
    this.releases()
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10)
  );

  ngOnInit(): void {
    this.loadReleases();
  }

  private loadReleases(): void {
    this.loading.set(true);
    this.releaseService.getAllReleases().subscribe({
      next: (releases) => {
        this.releases.set(releases);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading releases:', error);
        this.loading.set(false);
      }
    });
  }

  getStatusDescription(status: ReleaseStatus): string {
    return STATUS_DESCRIPTIONS[status] || status;
  }

  getStatusColor(status: ReleaseStatus): string {
    switch (status) {
      case ReleaseStatus.DISPONIVEL:
      case ReleaseStatus.APROVADA_TESTE:
      case ReleaseStatus.APROVADA_TESTE_REGRESSIVO:
        return 'green';
      case ReleaseStatus.FALHA_BUILD_TESTE:
      case ReleaseStatus.FALHA_BUILD_PRODUCAO:
      case ReleaseStatus.REPROVADA_TESTE:
      case ReleaseStatus.REPROVADA_TESTE_REGRESSIVO:
      case ReleaseStatus.REVOGADA:
        return 'red';
      case ReleaseStatus.EM_TESTE_SISTEMA:
      case ReleaseStatus.EM_TESTE_REGRESSIVO:
        return 'orange';
      case ReleaseStatus.CONTROLADA:
        return 'purple';
      default:
        return 'blue';
    }
  }

  getVersionTypeColor(versionType: string): string {
    switch (versionType) {
      case 'KIT': return 'red';
      case 'SERVICE_PACK': return 'orange';
      case 'PATCH': return 'green';
      default: return 'blue';
    }
  }

  viewRelease(release: Release): void {
    // Navigate to release details
    console.log('View release:', release);
  }
}