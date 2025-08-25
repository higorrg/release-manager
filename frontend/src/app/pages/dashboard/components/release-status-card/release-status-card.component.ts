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

import { ReleaseStatistics, ReleaseStatus } from '../../../../shared/models/release.model';

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
        status: ReleaseStatus.PENDING,
        label: 'Pendentes',
        count: counts[ReleaseStatus.PENDING] || 0,
        color: 'gold',
        icon: 'clock-circle'
      },
      {
        status: ReleaseStatus.IN_PROGRESS,
        label: 'Em Progresso',
        count: counts[ReleaseStatus.IN_PROGRESS] || 0,
        color: 'blue',
        icon: 'loading'
      },
      {
        status: ReleaseStatus.TESTING,
        label: 'Em Teste',
        count: counts[ReleaseStatus.TESTING] || 0,
        color: 'purple',
        icon: 'experiment'
      },
      {
        status: ReleaseStatus.COMPLETED,
        label: 'Concluídos',
        count: counts[ReleaseStatus.COMPLETED] || 0,
        color: 'green',
        icon: 'check-circle'
      },
      {
        status: ReleaseStatus.CANCELLED,
        label: 'Cancelados',
        count: counts[ReleaseStatus.CANCELLED] || 0,
        color: 'red',
        icon: 'close-circle'
      },
      {
        status: ReleaseStatus.ON_HOLD,
        label: 'Em Espera',
        count: counts[ReleaseStatus.ON_HOLD] || 0,
        color: 'default',
        icon: 'pause-circle'
      }
    ];
  });

  completionRate = computed(() => {
    const total = this.totalReleases();
    const completed = this.statusCounts()[ReleaseStatus.COMPLETED] || 0;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  });

  activeReleases = computed(() => {
    const counts = this.statusCounts();
    return (counts[ReleaseStatus.IN_PROGRESS] || 0) + 
           (counts[ReleaseStatus.TESTING] || 0);
  });

  getStatusPercentage(count: number): number {
    const total = this.totalReleases();
    return total > 0 ? Math.round((count / total) * 100) : 0;
  }

  getProgressColor(status: ReleaseStatus): string {
    const colorMap = {
      [ReleaseStatus.PENDING]: '#faad14',
      [ReleaseStatus.IN_PROGRESS]: '#1890ff',
      [ReleaseStatus.TESTING]: '#722ed1',
      [ReleaseStatus.COMPLETED]: '#52c41a',
      [ReleaseStatus.CANCELLED]: '#f5222d',
      [ReleaseStatus.ON_HOLD]: '#d9d9d9'
    };
    return colorMap[status];
  }
}