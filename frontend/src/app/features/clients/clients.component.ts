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
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzMessageService } from 'ng-zorro-antd/message';

import { Client, CreateClientRequest, UpdateClientRequest } from '../../shared/models/client.model';
import { ClientService } from '../../shared/services/client.service';

@Component({
  selector: 'app-clients',
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
    NzSwitchModule,
    NzCheckboxModule,
    NzIconModule,
    NzSpaceModule
  ],
  template: `
    <div class="page-header">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h1>Clientes</h1>
        <button nz-button nzType="primary" (click)="openCreateModal()">
          <span nz-icon nzType="plus"></span>
          Novo Cliente
        </button>
      </div>
    </div>
    
    <div class="content-container">
      <nz-card>
        <nz-table 
          #clientsTable 
          [nzData]="clients()"
          [nzLoading]="loading()"
          nzShowPagination
          nzShowSizeChanger
          [nzPageSize]="20">
          <thead>
            <tr>
              <th nzSortKey="clientCode" nzShowSort>Código</th>
              <th nzSortKey="companyName" nzShowSort>Empresa</th>
              <th>Contato</th>
              <th>Status</th>
              <th>Beta Partner</th>
              <th nzSortKey="createdAt" nzShowSort>Criado em</th>
              <th nzWidth="200px">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let client of clientsTable.data">
              <td>
                <strong>{{ client.clientCode }}</strong>
              </td>
              <td>{{ client.companyName }}</td>
              <td>
                <div *ngIf="client.contactEmail">
                  <span nz-icon nzType="mail"></span>
                  {{ client.contactEmail }}
                </div>
                <div *ngIf="client.contactPhone">
                  <span nz-icon nzType="phone"></span>
                  {{ client.contactPhone }}
                </div>
              </td>
              <td>
                <nz-tag [nzColor]="client.isActive ? 'green' : 'red'">
                  {{ client.isActive ? 'Ativo' : 'Inativo' }}
                </nz-tag>
              </td>
              <td>
                <nz-tag *ngIf="client.isBetaPartner" nzColor="purple">
                  Beta Partner
                </nz-tag>
              </td>
              <td>{{ client.createdAt | date:'dd/MM/yyyy' }}</td>
              <td>
                <nz-space nzSize="small">
                  <button 
                    *nzSpaceItem
                    nz-button 
                    nzSize="small" 
                    nzType="primary"
                    (click)="openEditModal(client)">
                    <span nz-icon nzType="edit"></span>
                  </button>
                  <button 
                    *nzSpaceItem
                    nz-button 
                    nzSize="small"
                    [nzType]="client.isActive ? 'default' : 'primary'"
                    (click)="toggleClientStatus(client)">
                    <span nz-icon [nzType]="client.isActive ? 'stop' : 'play-circle'"></span>
                    {{ client.isActive ? 'Desativar' : 'Ativar' }}
                  </button>
                </nz-space>
              </td>
            </tr>
          </tbody>
        </nz-table>
      </nz-card>
    </div>

    <!-- Create/Edit Client Modal -->
    <nz-modal
      [(nzVisible)]="modalVisible"
      [nzTitle]="isEditMode ? 'Editar Cliente' : 'Novo Cliente'"
      nzOkText="Salvar"
      nzCancelText="Cancelar"
[nzOkLoading]="saving()"
      (nzOnOk)="saveClient()"
      (nzOnCancel)="modalVisible = false">
      
      <ng-container *nzModalContent>
        <form nz-form nzLayout="vertical">
          <nz-form-item>
            <nz-form-label nzRequired>Código do Cliente</nz-form-label>
            <nz-form-control>
              <input 
                nz-input 
                [(ngModel)]="clientForm.clientCode" 
                name="clientCode"
                [disabled]="isEditMode"
                placeholder="Ex: EMPRESA_A">
            </nz-form-control>
          </nz-form-item>
          
          <nz-form-item>
            <nz-form-label nzRequired>Nome da Empresa</nz-form-label>
            <nz-form-control>
              <input 
                nz-input 
                [(ngModel)]="clientForm.companyName" 
                name="companyName"
                placeholder="Nome da empresa">
            </nz-form-control>
          </nz-form-item>
          
          <nz-form-item>
            <nz-form-label>Email de Contato</nz-form-label>
            <nz-form-control>
              <input 
                nz-input 
                [(ngModel)]="clientForm.contactEmail" 
                name="contactEmail"
                type="email"
                placeholder="contato@empresa.com">
            </nz-form-control>
          </nz-form-item>
          
          <nz-form-item>
            <nz-form-label>Telefone</nz-form-label>
            <nz-form-control>
              <input 
                nz-input 
                [(ngModel)]="clientForm.contactPhone" 
                name="contactPhone"
                placeholder="(11) 1234-5678">
            </nz-form-control>
          </nz-form-item>
          
          <nz-form-item>
            <nz-form-control>
              <label nz-checkbox [(ngModel)]="clientForm.isBetaPartner" name="isBetaPartner">
                Cliente Beta Partner
              </label>
            </nz-form-control>
          </nz-form-item>
          
          <nz-form-item>
            <nz-form-label>Observações</nz-form-label>
            <nz-form-control>
              <textarea 
                nz-input 
                [(ngModel)]="clientForm.notes" 
                name="notes"
                nzAutosize
                placeholder="Observações sobre o cliente">
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
export class ClientsComponent implements OnInit {
  private clientService = inject(ClientService);
  private message = inject(NzMessageService);
  
  clients = signal<Client[]>([]);
  loading = signal(false);
  saving = signal(false);
  modalVisible = false;
  isEditMode = false;
  
  clientForm: CreateClientRequest & { clientCode: string } = {
    clientCode: '',
    companyName: '',
    contactEmail: '',
    contactPhone: '',
    isBetaPartner: false,
    notes: ''
  };

  ngOnInit(): void {
    this.loadClients();
  }

  private loadClients(): void {
    this.loading.set(true);
    this.clientService.getAllClients(false).subscribe({ // Show all clients (active and inactive)
      next: (clients) => {
        this.clients.set(clients);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.message.error('Erro ao carregar clientes');
        this.loading.set(false);
      }
    });
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.clientForm = {
      clientCode: '',
      companyName: '',
      contactEmail: '',
      contactPhone: '',
      isBetaPartner: false,
      notes: ''
    };
    this.modalVisible = true;
  }

  openEditModal(client: Client): void {
    this.isEditMode = true;
    this.clientForm = {
      clientCode: client.clientCode,
      companyName: client.companyName,
      contactEmail: client.contactEmail || '',
      contactPhone: client.contactPhone || '',
      isBetaPartner: client.isBetaPartner,
      notes: client.notes || ''
    };
    this.modalVisible = true;
  }

  saveClient(): void {
    if (!this.clientForm.clientCode || !this.clientForm.companyName) {
      this.message.error('Código e nome da empresa são obrigatórios');
      return;
    }

    this.saving.set(true);
    
    if (this.isEditMode) {
      // Update existing client
      const updateRequest: UpdateClientRequest = {
        companyName: this.clientForm.companyName,
        contactEmail: this.clientForm.contactEmail || undefined,
        contactPhone: this.clientForm.contactPhone || undefined,
        isBetaPartner: this.clientForm.isBetaPartner,
        notes: this.clientForm.notes || undefined
      };
      
      this.clientService.updateClient(this.clientForm.clientCode, updateRequest).subscribe({
        next: () => {
          this.message.success('Cliente atualizado com sucesso');
          this.modalVisible = false;
          this.saving.set(false);
          this.loadClients();
        },
        error: (error) => {
          console.error('Error updating client:', error);
          this.message.error('Erro ao atualizar cliente');
          this.saving.set(false);
        }
      });
    } else {
      // Create new client
      const createRequest: CreateClientRequest = {
        clientCode: this.clientForm.clientCode,
        companyName: this.clientForm.companyName,
        contactEmail: this.clientForm.contactEmail || undefined,
        contactPhone: this.clientForm.contactPhone || undefined,
        isBetaPartner: this.clientForm.isBetaPartner,
        notes: this.clientForm.notes || undefined
      };
      
      this.clientService.createClient(createRequest).subscribe({
        next: () => {
          this.message.success('Cliente criado com sucesso');
          this.modalVisible = false;
          this.saving.set(false);
          this.loadClients();
        },
        error: (error) => {
          console.error('Error creating client:', error);
          this.message.error('Erro ao criar cliente');
          this.saving.set(false);
        }
      });
    }
  }

  toggleClientStatus(client: Client): void {
    const action = client.isActive ? 'desativar' : 'ativar';
    const operation = client.isActive 
      ? this.clientService.deactivateClient(client.clientCode)
      : this.clientService.activateClient(client.clientCode);

    operation.subscribe({
      next: () => {
        this.message.success(`Cliente ${action}do com sucesso`);
        this.loadClients();
      },
      error: (error) => {
        console.error(`Error ${action}ing client:`, error);
        this.message.error(`Erro ao ${action} cliente`);
      }
    });
  }
}