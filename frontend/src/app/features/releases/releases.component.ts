import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzMessageService } from 'ng-zorro-antd/message';

import { Release, ReleaseStatus, UpdateStatusRequest, STATUS_DESCRIPTIONS } from '../../shared/models/release.model';
import { ReleaseService } from '../../shared/services/release.service';

@Component({
  selector: 'app-releases',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzTableModule,
    NzTagModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzIconModule,
    NzSpaceModule
  ],
  template: `
    <div class="page-header">
      <h1>Releases</h1>
    </div>
    
    <div class="content-container">
      <nz-card>
        <nz-table 
          #releasesTable 
          [nzData]="releases()"
          [nzLoading]="loading()"
          nzShowPagination
          nzShowSizeChanger
          [nzPageSize]="20">
          <thead>
            <tr>
              <th nzSortKey="productName" nzShowSort>Produto</th>
              <th nzSortKey="version" nzShowSort>Versão</th>
              <th nzSortKey="status" nzShowSort>Status</th>
              <th nzSortKey="createdAt" nzShowSort>Criado em</th>
              <th nzSortKey="updatedAt" nzShowSort>Atualizado em</th>
              <th nzWidth="200px">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let release of releasesTable.data">
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
              <td>{{ release.createdAt | date:'dd/MM/yyyy HH:mm' }}</td>
              <td>{{ release.updatedAt | date:'dd/MM/yyyy HH:mm' }}</td>
              <td>
                <nz-space nzSize="small">
                  <button 
                    *nzSpaceItem
                    nz-button 
                    nzSize="small" 
                    nzType="primary"
                    (click)="openStatusModal(release)">
                    <span nz-icon nzType="edit"></span>
                    Status
                  </button>
                  <button 
                    *nzSpaceItem
                    nz-button 
                    nzSize="small"
                    (click)="viewHistory(release)">
                    <span nz-icon nzType="history"></span>
                    Histórico
                  </button>
                  <button 
                    *nzSpaceItem
                    nz-button 
                    nzSize="small"
                    (click)="manageClients(release)">
                    <span nz-icon nzType="team"></span>
                    Clientes
                  </button>
                </nz-space>
              </td>
            </tr>
          </tbody>
        </nz-table>
      </nz-card>
    </div>

    <!-- Update Status Modal -->
    <nz-modal
      [(nzVisible)]="statusModalVisible"
      nzTitle="Atualizar Status"
      nzOkText="Salvar"
      nzCancelText="Cancelar"
[nzOkLoading]="updating()"
      (nzOnOk)="updateStatus()"
      (nzOnCancel)="statusModalVisible = false">
      
      <ng-container *nzModalContent>
        <form nz-form nzLayout="vertical">
          <nz-form-item>
            <nz-form-label>Release</nz-form-label>
            <nz-form-control>
              <span>{{ selectedRelease()?.productName }} {{ selectedRelease()?.version }}</span>
            </nz-form-control>
          </nz-form-item>
          
          <nz-form-item>
            <nz-form-label>Status Atual</nz-form-label>
            <nz-form-control>
              <nz-tag [nzColor]="getStatusColor(selectedRelease()?.status!)">
                {{ getStatusDescription(selectedRelease()?.status!) }}
              </nz-tag>
            </nz-form-control>
          </nz-form-item>
          
          <nz-form-item>
            <nz-form-label nzRequired>Novo Status</nz-form-label>
            <nz-form-control>
              <nz-select [(ngModel)]="updateRequest.newStatus" nzPlaceholder="Selecione o novo status" name="newStatus">
                <nz-option *ngFor="let status of statusOptions" [nzValue]="status" [nzLabel]="getStatusDescription(status)"></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item>
          
          <nz-form-item>
            <nz-form-label>Observação</nz-form-label>
            <nz-form-control>
              <textarea 
                nz-input 
                [(ngModel)]="updateRequest.reason" 
                name="reason"
                nzAutosize
                placeholder="Motivo da mudança de status (opcional)">
              </textarea>
            </nz-form-control>
          </nz-form-item>
        </form>
      </ng-container>
    </nz-modal>
  `,
  styles: [`
    .content-container {
      padding: 0 24px;
    }
  `]
})
export class ReleasesComponent implements OnInit {
  private releaseService = inject(ReleaseService);
  private message = inject(NzMessageService);
  
  releases = signal<Release[]>([]);
  loading = signal(false);
  updating = signal(false);
  statusModalVisible = false;
  selectedRelease = signal<Release | null>(null);
  
  updateRequest: UpdateStatusRequest = {
    newStatus: ReleaseStatus.MR_APROVADO,
    reason: ''
  };
  
  statusOptions = Object.values(ReleaseStatus);

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
        this.message.error('Erro ao carregar releases');
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

  openStatusModal(release: Release): void {
    this.selectedRelease.set(release);
    this.updateRequest = {
      newStatus: release.status,
      reason: ''
    };
    this.statusModalVisible = true;
  }

  updateStatus(): void {
    const release = this.selectedRelease();
    if (!release) return;

    this.updating.set(true);
    this.releaseService.updateReleaseStatus(release.id, this.updateRequest).subscribe({
      next: () => {
        this.message.success('Status atualizado com sucesso');
        this.statusModalVisible = false;
        this.updating.set(false);
        this.loadReleases(); // Reload to get updated data
      },
      error: (error) => {
        console.error('Error updating status:', error);
        this.message.error('Erro ao atualizar status');
        this.updating.set(false);
      }
    });
  }

  viewHistory(release: Release): void {
    // Implement history view modal
    console.log('View history for:', release);
  }

  manageClients(release: Release): void {
    // Implement client management modal
    console.log('Manage clients for:', release);
  }
}