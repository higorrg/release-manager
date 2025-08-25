import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';

import { 
  ReleaseStatistics, 
  ReleasePriority,
  ReleaseStatus 
} from '../../../../shared/models/release.model';
import { 
  ClientStatistics, 
  ClientType,
  ClientPriority 
} from '../../../../shared/models/client.model';

interface OverviewItem {
  label: string;
  value: number;
  icon: string;
  color: string;
  percentage?: number;
}

@Component({
  selector: 'app-statistics-overview',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzCardModule,
    NzIconModule,
    NzStatisticModule,
    NzGridModule,
    NzProgressModule,
    NzTagModule,
    NzDividerModule,
    NzButtonModule,
    NzSpaceModule
  ],
  templateUrl: './statistics-overview.component.html',
  styleUrls: ['./statistics-overview.component.scss']
})
export class StatisticsOverviewComponent {
  @Input() releaseStats!: ReleaseStatistics;
  @Input() clientStats!: ClientStatistics;

  // Computed statistics for releases by priority
  releasePriorityStats = computed(() => {
    if (!this.releaseStats) return [];
    
    const total = this.releaseStats.totalReleases;
    const priorities = this.releaseStats.releasesByPriority;
    
    return [
      {
        label: 'Crítico',
        value: priorities[ReleasePriority.CRITICAL] || 0,
        icon: 'exclamation-circle',
        color: '#f5222d',
        percentage: total > 0 ? Math.round(((priorities[ReleasePriority.CRITICAL] || 0) / total) * 100) : 0
      },
      {
        label: 'Alto',
        value: priorities[ReleasePriority.HIGH] || 0,
        icon: 'arrow-up',
        color: '#fa8c16',
        percentage: total > 0 ? Math.round(((priorities[ReleasePriority.HIGH] || 0) / total) * 100) : 0
      },
      {
        label: 'Médio',
        value: priorities[ReleasePriority.MEDIUM] || 0,
        icon: 'minus',
        color: '#faad14',
        percentage: total > 0 ? Math.round(((priorities[ReleasePriority.MEDIUM] || 0) / total) * 100) : 0
      },
      {
        label: 'Baixo',
        value: priorities[ReleasePriority.LOW] || 0,
        icon: 'arrow-down',
        color: '#52c41a',
        percentage: total > 0 ? Math.round(((priorities[ReleasePriority.LOW] || 0) / total) * 100) : 0
      }
    ];
  });

  // Computed statistics for clients by type
  clientTypeStats = computed(() => {
    if (!this.clientStats) return [];
    
    const total = this.clientStats.totalClients;
    const types = this.clientStats.clientsByType;
    
    return [
      {
        label: 'Empresarial',
        value: types[ClientType.ENTERPRISE] || 0,
        icon: 'bank',
        color: '#1890ff',
        percentage: total > 0 ? Math.round(((types[ClientType.ENTERPRISE] || 0) / total) * 100) : 0
      },
      {
        label: 'PME',
        value: types[ClientType.SMB] || 0,
        icon: 'shop',
        color: '#722ed1',
        percentage: total > 0 ? Math.round(((types[ClientType.SMB] || 0) / total) * 100) : 0
      },
      {
        label: 'Startup',
        value: types[ClientType.STARTUP] || 0,
        icon: 'rocket',
        color: '#13c2c2',
        percentage: total > 0 ? Math.round(((types[ClientType.STARTUP] || 0) / total) * 100) : 0
      },
      {
        label: 'Governo',
        value: types[ClientType.GOVERNMENT] || 0,
        icon: 'flag',
        color: '#eb2f96',
        percentage: total > 0 ? Math.round(((types[ClientType.GOVERNMENT] || 0) / total) * 100) : 0
      },
      {
        label: 'Parceiro',
        value: types[ClientType.PARTNER] || 0,
        icon: 'team',
        color: '#52c41a',
        percentage: total > 0 ? Math.round(((types[ClientType.PARTNER] || 0) / total) * 100) : 0
      }
    ];
  });

  // Key metrics
  keyMetrics = computed(() => {
    if (!this.releaseStats || !this.clientStats) return [];

    const activeReleases = (this.releaseStats.releasesByStatus[ReleaseStatus.IN_PROGRESS] || 0) + 
                          (this.releaseStats.releasesByStatus[ReleaseStatus.TESTING] || 0);
    
    const completionRate = this.releaseStats.totalReleases > 0 ? 
                          Math.round(((this.releaseStats.releasesByStatus[ReleaseStatus.COMPLETED] || 0) / this.releaseStats.totalReleases) * 100) : 0;

    const clientActivationRate = this.clientStats.totalClients > 0 ? 
                                 Math.round((this.clientStats.activeClients / this.clientStats.totalClients) * 100) : 0;

    return [
      {
        label: 'Releases Ativos',
        value: activeReleases,
        icon: 'loading',
        color: '#1890ff'
      },
      {
        label: 'Taxa de Conclusão',
        value: completionRate,
        icon: 'check-circle',
        color: '#52c41a',
        suffix: '%'
      },
      {
        label: 'Clientes Ativos',
        value: this.clientStats.activeClients,
        icon: 'user-switch',
        color: '#722ed1'
      },
      {
        label: 'Taxa de Ativação',
        value: clientActivationRate,
        icon: 'rise',
        color: '#13c2c2',
        suffix: '%'
      }
    ];
  });

  // Performance indicators
  performanceData = computed(() => {
    if (!this.releaseStats) return null;

    const total = this.releaseStats.totalReleases;
    const completed = this.releaseStats.releasesByStatus[ReleaseStatus.COMPLETED] || 0;
    const inProgress = this.releaseStats.releasesByStatus[ReleaseStatus.IN_PROGRESS] || 0;
    const pending = this.releaseStats.releasesByStatus[ReleaseStatus.PENDING] || 0;
    
    return {
      efficiency: total > 0 ? Math.round((completed / total) * 100) : 0,
      productivity: total > 0 ? Math.round((inProgress / total) * 100) : 0,
      backlog: total > 0 ? Math.round((pending / total) * 100) : 0
    };
  });

  getTopPerformingType(): OverviewItem | null {
    const types = this.clientTypeStats();
    return types.length > 0 ? types.reduce((max, current) => 
      current.value > max.value ? current : max
    ) : null;
  }

  getHighestPriority(): OverviewItem | null {
    const priorities = this.releasePriorityStats();
    return priorities.length > 0 ? priorities.reduce((max, current) => 
      current.value > max.value ? current : max
    ) : null;
  }

  getHealthScore(): number {
    if (!this.releaseStats || !this.clientStats) return 0;
    
    const completionRate = this.releaseStats.totalReleases > 0 ? 
                          (this.releaseStats.releasesByStatus[ReleaseStatus.COMPLETED] || 0) / this.releaseStats.totalReleases : 0;
    
    const activationRate = this.clientStats.totalClients > 0 ? 
                          this.clientStats.activeClients / this.clientStats.totalClients : 0;
    
    const cancelledRate = this.releaseStats.totalReleases > 0 ? 
                         (this.releaseStats.releasesByStatus[ReleaseStatus.CANCELLED] || 0) / this.releaseStats.totalReleases : 0;
    
    // Health score algorithm: completion and activation rates positive, cancellation rate negative
    const healthScore = ((completionRate * 40) + (activationRate * 40) - (cancelledRate * 20)) * 100;
    
    return Math.max(0, Math.min(100, Math.round(healthScore)));
  }

  getHealthColor(): string {
    const score = this.getHealthScore();
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#faad14';
    if (score >= 40) return '#fa8c16';
    return '#f5222d';
  }

  getHealthStatus(): string {
    const score = this.getHealthScore();
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    if (score >= 40) return 'Regular';
    return 'Precisa Atenção';
  }
}