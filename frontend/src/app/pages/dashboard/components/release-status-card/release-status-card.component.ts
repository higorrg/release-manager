import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';

import { ReleaseStatistics, ReleaseStatus, ReleaseStatusDisplayNames } from '../../../../shared/models/release.model';

@Component({
  selector: 'app-release-status-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzCardModule,
    NzIconModule,
    NzTagModule,
    NzProgressModule,
    NzGridModule,
    NzStatisticModule,
    NzButtonModule,
    NzSpaceModule
  ],
  templateUrl: './release-status-card.component.html',
  styleUrls: ['./release-status-card.component.scss']
})
export class ReleaseStatusCardComponent {
  @Input() statistics!: ReleaseStatistics;

  // Expose ReleaseStatus enum to template
  ReleaseStatus = ReleaseStatus;

  // Computed values for better performance
  totalReleases = computed(() => this.statistics?.totalReleases || 0);
  
  statusCounts = computed(() => {
    if (!this.statistics) return {};
    return this.statistics.releasesByStatus;
  });

  statusItems = computed(() => {
    const counts = this.statusCounts();
    return [
      {
        status: ReleaseStatus.MR_APROVADO,
        label: ReleaseStatusDisplayNames[ReleaseStatus.MR_APROVADO],
        count: counts[ReleaseStatus.MR_APROVADO] || 0,
        color: 'blue',
        icon: 'check-circle'
      },
      {
        status: ReleaseStatus.FALHA_BUILD_TESTE,
        label: ReleaseStatusDisplayNames[ReleaseStatus.FALHA_BUILD_TESTE],
        count: counts[ReleaseStatus.FALHA_BUILD_TESTE] || 0,
        color: 'red',
        icon: 'close-circle'
      },
      {
        status: ReleaseStatus.PARA_TESTE_SISTEMA,
        label: ReleaseStatusDisplayNames[ReleaseStatus.PARA_TESTE_SISTEMA],
        count: counts[ReleaseStatus.PARA_TESTE_SISTEMA] || 0,
        color: 'gold',
        icon: 'clock-circle'
      },
      {
        status: ReleaseStatus.EM_TESTE_SISTEMA,
        label: ReleaseStatusDisplayNames[ReleaseStatus.EM_TESTE_SISTEMA],
        count: counts[ReleaseStatus.EM_TESTE_SISTEMA] || 0,
        color: 'purple',
        icon: 'experiment'
      },
      {
        status: ReleaseStatus.REPROVADA_TESTE,
        label: ReleaseStatusDisplayNames[ReleaseStatus.REPROVADA_TESTE],
        count: counts[ReleaseStatus.REPROVADA_TESTE] || 0,
        color: 'red',
        icon: 'close-circle'
      },
      {
        status: ReleaseStatus.APROVADA_TESTE,
        label: ReleaseStatusDisplayNames[ReleaseStatus.APROVADA_TESTE],
        count: counts[ReleaseStatus.APROVADA_TESTE] || 0,
        color: 'green',
        icon: 'check-circle'
      },
      {
        status: ReleaseStatus.FALHA_BUILD_PRODUCAO,
        label: ReleaseStatusDisplayNames[ReleaseStatus.FALHA_BUILD_PRODUCAO],
        count: counts[ReleaseStatus.FALHA_BUILD_PRODUCAO] || 0,
        color: 'red',
        icon: 'close-circle'
      },
      {
        status: ReleaseStatus.PARA_TESTE_REGRESSIVO,
        label: ReleaseStatusDisplayNames[ReleaseStatus.PARA_TESTE_REGRESSIVO],
        count: counts[ReleaseStatus.PARA_TESTE_REGRESSIVO] || 0,
        color: 'gold',
        icon: 'clock-circle'
      },
      {
        status: ReleaseStatus.EM_TESTE_REGRESSIVO,
        label: ReleaseStatusDisplayNames[ReleaseStatus.EM_TESTE_REGRESSIVO],
        count: counts[ReleaseStatus.EM_TESTE_REGRESSIVO] || 0,
        color: 'purple',
        icon: 'experiment'
      },
      {
        status: ReleaseStatus.FALHA_INSTALACAO_ESTAVEL,
        label: ReleaseStatusDisplayNames[ReleaseStatus.FALHA_INSTALACAO_ESTAVEL],
        count: counts[ReleaseStatus.FALHA_INSTALACAO_ESTAVEL] || 0,
        color: 'red',
        icon: 'warning'
      },
      {
        status: ReleaseStatus.INTERNO,
        label: ReleaseStatusDisplayNames[ReleaseStatus.INTERNO],
        count: counts[ReleaseStatus.INTERNO] || 0,
        color: 'default',
        icon: 'home'
      },
      {
        status: ReleaseStatus.REVOGADA,
        label: ReleaseStatusDisplayNames[ReleaseStatus.REVOGADA],
        count: counts[ReleaseStatus.REVOGADA] || 0,
        color: 'red',
        icon: 'stop'
      },
      {
        status: ReleaseStatus.REPROVADA_TESTE_REGRESSIVO,
        label: ReleaseStatusDisplayNames[ReleaseStatus.REPROVADA_TESTE_REGRESSIVO],
        count: counts[ReleaseStatus.REPROVADA_TESTE_REGRESSIVO] || 0,
        color: 'red',
        icon: 'close-circle'
      },
      {
        status: ReleaseStatus.APROVADA_TESTE_REGRESSIVO,
        label: ReleaseStatusDisplayNames[ReleaseStatus.APROVADA_TESTE_REGRESSIVO],
        count: counts[ReleaseStatus.APROVADA_TESTE_REGRESSIVO] || 0,
        color: 'green',
        icon: 'check-circle'
      },
      {
        status: ReleaseStatus.CONTROLADA,
        label: ReleaseStatusDisplayNames[ReleaseStatus.CONTROLADA],
        count: counts[ReleaseStatus.CONTROLADA] || 0,
        color: 'lime',
        icon: 'lock'
      },
      {
        status: ReleaseStatus.DISPONIVEL,
        label: ReleaseStatusDisplayNames[ReleaseStatus.DISPONIVEL],
        count: counts[ReleaseStatus.DISPONIVEL] || 0,
        color: 'green',
        icon: 'cloud-download'
      }
    ];
  });

  completionRate = computed(() => {
    const total = this.totalReleases();
    const counts = this.statusCounts();
    const completed = (counts[ReleaseStatus.CONTROLADA] || 0) + 
                     (counts[ReleaseStatus.DISPONIVEL] || 0);
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  });

  activeReleases = computed(() => {
    const counts = this.statusCounts();
    return (counts[ReleaseStatus.EM_TESTE_SISTEMA] || 0) + 
           (counts[ReleaseStatus.EM_TESTE_REGRESSIVO] || 0) + 
           (counts[ReleaseStatus.PARA_TESTE_SISTEMA] || 0) + 
           (counts[ReleaseStatus.PARA_TESTE_REGRESSIVO] || 0);
  });

  getStatusPercentage(count: number): number {
    const total = this.totalReleases();
    return total > 0 ? Math.round((count / total) * 100) : 0;
  }

  getProgressColor(status: ReleaseStatus): string {
    const colorMap = {
      [ReleaseStatus.MR_APROVADO]: '#1890ff',
      [ReleaseStatus.FALHA_BUILD_TESTE]: '#f5222d',
      [ReleaseStatus.PARA_TESTE_SISTEMA]: '#faad14',
      [ReleaseStatus.EM_TESTE_SISTEMA]: '#722ed1',
      [ReleaseStatus.REPROVADA_TESTE]: '#f5222d',
      [ReleaseStatus.APROVADA_TESTE]: '#52c41a',
      [ReleaseStatus.FALHA_BUILD_PRODUCAO]: '#f5222d',
      [ReleaseStatus.PARA_TESTE_REGRESSIVO]: '#faad14',
      [ReleaseStatus.EM_TESTE_REGRESSIVO]: '#722ed1',
      [ReleaseStatus.FALHA_INSTALACAO_ESTAVEL]: '#f5222d',
      [ReleaseStatus.INTERNO]: '#d9d9d9',
      [ReleaseStatus.REVOGADA]: '#f5222d',
      [ReleaseStatus.REPROVADA_TESTE_REGRESSIVO]: '#f5222d',
      [ReleaseStatus.APROVADA_TESTE_REGRESSIVO]: '#52c41a',
      [ReleaseStatus.CONTROLADA]: '#a0d911',
      [ReleaseStatus.DISPONIVEL]: '#52c41a'
    };
    return colorMap[status];
  }
}