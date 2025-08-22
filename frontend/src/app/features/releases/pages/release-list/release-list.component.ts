import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { ReleaseService } from '@shared/services/release.service';
import { Release, StatusOption } from '@shared/models/release.model';
import { CreateReleaseDialogComponent } from '../../components/create-release-dialog/create-release-dialog.component';

@Component({
  selector: 'app-release-list',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDialogModule
  ],
  template: `
    <div class="release-list-container">
      <mat-card class="filters-card">
        <mat-card-header>
          <mat-card-title>Filtros</mat-card-title>
          <div class="spacer"></div>
          <button 
            mat-raised-button 
            color="primary" 
            (click)="openCreateDialog()">
            <mat-icon>add</mat-icon>
            Nova Release
          </button>
        </mat-card-header>
        
        <mat-card-content>
          <div class="filters-row">
            <mat-form-field>
              <mat-label>Produto</mat-label>
              <input 
                matInput 
                [(ngModel)]="filters.productName"
                (input)="onFilterChange()"
                placeholder="Nome do produto">
            </mat-form-field>
            
            <mat-form-field>
              <mat-label>Versão</mat-label>
              <input 
                matInput 
                [(ngModel)]="filters.version"
                (input)="onFilterChange()"
                placeholder="Versão">
            </mat-form-field>
            
            <mat-form-field>
              <mat-label>Status</mat-label>
              <mat-select 
                [(ngModel)]="filters.status"
                (selectionChange)="onFilterChange()">
                <mat-option value="">Todos</mat-option>
                @for (status of statusOptions(); track status.value) {
                  <mat-option [value]="status.label">{{ status.label }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            
            <button 
              mat-button 
              color="accent" 
              (click)="clearFilters()">
              <mat-icon>clear</mat-icon>
              Limpar
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="table-card">
        <mat-card-content>
          @if (loading()) {
            <div class="loading-container">
              <mat-spinner></mat-spinner>
            </div>
          } @else {
            <table mat-table [dataSource]="releases()" class="releases-table">
              <ng-container matColumnDef="version">
                <th mat-header-cell *matHeaderCellDef>Versão</th>
                <td mat-cell *matCellDef="let release">
                  <strong>{{ release.version }}</strong>
                </td>
              </ng-container>

              <ng-container matColumnDef="product">
                <th mat-header-cell *matHeaderCellDef>Produto</th>
                <td mat-cell *matCellDef="let release">{{ release.productName }}</td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let release">
                  <mat-chip 
                    [class]="'status-' + getStatusClass(release.status)"
                    color="primary">
                    {{ release.status }}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef>Criado em</th>
                <td mat-cell *matCellDef="let release">
                  {{ release.createdAt | date:'dd/MM/yyyy HH:mm' }}
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Ações</th>
                <td mat-cell *matCellDef="let release">
                  <button 
                    mat-icon-button 
                    color="primary"
                    [routerLink]="['/releases', release.id]">
                    <mat-icon>visibility</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
            
            <mat-paginator 
              [length]="totalElements()"
              [pageSize]="pageSize"
              [pageSizeOptions]="[10, 20, 50]"
              (page)="onPageChange($event)"
              showFirstLastButtons>
            </mat-paginator>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .release-list-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .filters-card {
      margin-bottom: 16px;
    }

    .filters-card mat-card-header {
      display: flex;
      align-items: center;
    }

    .spacer {
      flex: 1;
    }

    .filters-row {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .filters-row mat-form-field {
      min-width: 200px;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 32px;
    }

    .releases-table {
      width: 100%;
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

    .status-aprovada {
      background-color: #4caf50 !important;
    }

    .status-reprovada {
      background-color: #f44336 !important;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReleaseListComponent implements OnInit {
  private releaseService = inject(ReleaseService);
  private dialog = inject(MatDialog);

  loading = signal(true);
  releases = signal<Release[]>([]);
  statusOptions = signal<StatusOption[]>([]);
  totalElements = signal(0);
  
  displayedColumns = ['version', 'product', 'status', 'createdAt', 'actions'];
  pageSize = 20;
  currentPage = 0;
  
  filters = {
    productName: '',
    version: '',
    status: ''
  };

  ngOnInit() {
    this.loadStatusOptions();
    this.loadReleases();
  }

  private loadStatusOptions() {
    this.releaseService.getStatusOptions().subscribe({
      next: (options) => this.statusOptions.set(options)
    });
  }

  private loadReleases() {
    this.loading.set(true);
    
    const params = {
      page: this.currentPage,
      size: this.pageSize,
      ...this.getActiveFilters()
    };

    this.releaseService.getReleases(params).subscribe({
      next: (result) => {
        this.releases.set(result.releases);
        this.totalElements.set(result.totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  private getActiveFilters() {
    const activeFilters: any = {};
    
    if (this.filters.productName.trim()) {
      activeFilters.productName = this.filters.productName.trim();
    }
    
    if (this.filters.version.trim()) {
      activeFilters.version = this.filters.version.trim();
    }
    
    if (this.filters.status) {
      activeFilters.status = this.filters.status;
    }
    
    return activeFilters;
  }

  onFilterChange() {
    this.currentPage = 0;
    this.loadReleases();
  }

  clearFilters() {
    this.filters = {
      productName: '',
      version: '',
      status: ''
    };
    this.onFilterChange();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadReleases();
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(CreateReleaseDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadReleases();
      }
    });
  }

  getStatusClass(status: string): string {
    if (status === 'Disponível') return 'disponivel';
    if (status === 'Controlada') return 'controlada';
    if (status === 'MR Aprovado') return 'mr-aprovado';
    if (status.includes('Teste')) return 'teste';
    if (status.includes('Falha')) return 'falha';
    if (status.includes('Aprovada')) return 'aprovada';
    if (status.includes('Reprovada')) return 'reprovada';
    return 'default';
  }
}