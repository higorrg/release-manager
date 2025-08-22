import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { ClientService } from '@shared/services/client.service';
import { Client } from '@shared/models/client.model';
import { CreateClientDialogComponent } from '../../components/create-client-dialog/create-client-dialog.component';

@Component({
  selector: 'app-client-list',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDialogModule,
    MatSlideToggleModule
  ],
  template: `
    <div class="client-list-container">
      <mat-card class="header-card">
        <mat-card-header>
          <mat-card-title>Clientes</mat-card-title>
          <div class="spacer"></div>
          <button 
            mat-raised-button 
            color="primary" 
            (click)="openCreateDialog()">
            <mat-icon>add</mat-icon>
            Novo Cliente
          </button>
        </mat-card-header>
      </mat-card>

      <mat-card class="table-card">
        <mat-card-content>
          @if (loading()) {
            <div class="loading-container">
              <mat-spinner></mat-spinner>
            </div>
          } @else {
            <table mat-table [dataSource]="clients()" class="clients-table">
              <ng-container matColumnDef="code">
                <th mat-header-cell *matHeaderCellDef>Código</th>
                <td mat-cell *matCellDef="let client">
                  <strong>{{ client.code }}</strong>
                </td>
              </ng-container>

              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Nome</th>
                <td mat-cell *matCellDef="let client">{{ client.name }}</td>
              </ng-container>

              <ng-container matColumnDef="active">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let client">
                  <mat-chip [color]="client.active ? 'primary' : 'warn'">
                    {{ client.active ? 'Ativo' : 'Inativo' }}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef>Criado em</th>
                <td mat-cell *matCellDef="let client">
                  {{ client.createdAt | date:'dd/MM/yyyy HH:mm' }}
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Ações</th>
                <td mat-cell *matCellDef="let client">
                  <mat-slide-toggle
                    [checked]="client.active"
                    (change)="toggleClientStatus(client, $event.checked)"
                    [disabled]="updatingClients().has(client.id)">
                  </mat-slide-toggle>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            @if (clients().length === 0) {
              <div class="empty-state">
                <mat-icon>people</mat-icon>
                <p>Nenhum cliente cadastrado</p>
                <button mat-raised-button color="primary" (click)="openCreateDialog()">
                  Cadastrar Primeiro Cliente
                </button>
              </div>
            }
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .client-list-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .header-card {
      margin-bottom: 16px;
    }

    .header-card mat-card-header {
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

    .clients-table {
      width: 100%;
    }

    .empty-state {
      text-align: center;
      padding: 48px;
      color: #666;
    }

    .empty-state mat-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
      margin-bottom: 16px;
    }

    .empty-state p {
      font-size: 18px;
      margin-bottom: 24px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientListComponent implements OnInit {
  private clientService = inject(ClientService);
  private dialog = inject(MatDialog);

  loading = signal(true);
  clients = signal<Client[]>([]);
  updatingClients = signal(new Set<number>());
  
  displayedColumns = ['code', 'name', 'active', 'createdAt', 'actions'];

  ngOnInit() {
    this.loadClients();
  }

  private loadClients() {
    this.loading.set(true);
    
    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.clients.set(clients);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(CreateClientDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClients();
      }
    });
  }

  toggleClientStatus(client: Client, active: boolean) {
    const updating = this.updatingClients();
    updating.add(client.id);
    this.updatingClients.set(new Set(updating));

    this.clientService.updateClient(client.id, {
      name: client.name,
      active: active
    }).subscribe({
      next: () => {
        this.loadClients();
        const updated = this.updatingClients();
        updated.delete(client.id);
        this.updatingClients.set(new Set(updated));
      },
      error: () => {
        const updated = this.updatingClients();
        updated.delete(client.id);
        this.updatingClients.set(new Set(updated));
      }
    });
  }
}