import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ClientService } from '../../../shared/services/client.service';
import { Client, CreateClientRequest, UpdateClientRequest } from '../../../shared/models/client.model';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  template: `
    <div class="client-list-container">
      <!-- Header -->
      <div class="page-header" style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1 style="margin: 0; color: #333; font-size: 24px;">👥 Gerenciamento de Clientes</h1>
          <p style="margin: 5px 0 0 0; color: #666;">Cadastre e gerencie os clientes do sistema</p>
        </div>
        <button 
          (click)="openCreateModal()" 
          style="background: #52c41a; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; font-size: 14px;">
          ➕ Novo Cliente
        </button>
      </div>

      <!-- Stats Card -->
      <div class="stats-card" style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; text-align: center;">
          <div>
            <div style="font-size: 24px; color: #1890ff; margin-bottom: 5px;">{{ clients.length }}</div>
            <div style="color: #666; font-size: 14px;">Total de Clientes</div>
          </div>
          <div>
            <div style="font-size: 24px; color: #52c41a; margin-bottom: 5px;">{{ getActiveClients() }}</div>
            <div style="color: #666; font-size: 14px;">Ativos</div>
          </div>
          <div>
            <div style="font-size: 24px; color: #ff4d4f; margin-bottom: 5px;">{{ getInactiveClients() }}</div>
            <div style="color: #666; font-size: 14px;">Inativos</div>
          </div>
        </div>
      </div>

      <!-- Clients Table -->
      <div class="clients-table" style="background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead style="background: #fafafa; border-bottom: 1px solid #f0f0f0;">
            <tr>
              <th style="padding: 16px; text-align: left; font-weight: 500; color: #333;">Código</th>
              <th style="padding: 16px; text-align: left; font-weight: 500; color: #333;">Nome</th>
              <th style="padding: 16px; text-align: left; font-weight: 500; color: #333;">Criado em</th>
              <th style="padding: 16px; text-align: center; font-weight: 500; color: #333;">Status</th>
              <th style="padding: 16px; text-align: center; font-weight: 500; color: #333;">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let client of clients; let i = index" style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 16px; font-weight: 500; color: #333;">{{ client.code }}</td>
              <td style="padding: 16px; color: #333;">{{ client.name }}</td>
              <td style="padding: 16px; color: #666;">{{ client.createdAt | date:'short' }}</td>
              <td style="padding: 16px; text-align: center;">
                <span 
                  [style.background-color]="client.active ? '#f6ffed' : '#fff2f0'"
                  [style.color]="client.active ? '#52c41a' : '#ff4d4f'"
                  style="padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500;">
                  {{ client.active ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td style="padding: 16px; text-align: center;">
                <div style="display: flex; gap: 8px; justify-content: center;">
                  <button 
                    (click)="editClient(i)"
                    style="background: #1890ff; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                    ✏️ Editar
                  </button>
                  <button 
                    (click)="deleteClient(i)"
                    style="background: #ff4d4f; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                    🗑️ Excluir
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div *ngIf="clients.length === 0" style="text-align: center; padding: 60px 20px; color: #666; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="font-size: 48px; margin-bottom: 20px;">👥</div>
        <h3 style="color: #666; margin-bottom: 10px;">Nenhum cliente cadastrado</h3>
        <p style="margin-bottom: 20px;">Adicione o primeiro cliente para começar.</p>
        <button 
          (click)="openCreateModal()"
          style="background: #52c41a; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; font-size: 14px;">
          ➕ Adicionar Cliente
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div *ngIf="showModal" 
         style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;"
         (click)="closeModal()">
      <div style="background: white; padding: 30px; border-radius: 8px; width: 90%; max-width: 500px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);"
           (click)="$event.stopPropagation()">
        <h2 style="margin: 0 0 20px 0; color: #333;">{{ isEditMode ? '✏️ Editar Cliente' : '➕ Novo Cliente' }}</h2>
        
        <form [formGroup]="clientForm" (ngSubmit)="onSubmit()">
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">Código *</label>
            <input 
              type="text" 
              formControlName="code"
              placeholder="Ex: CLI001"
              [readonly]="isEditMode"
              style="width: 100%; padding: 12px; border: 1px solid #d9d9d9; border-radius: 6px; font-size: 14px;"
              [style.border-color]="clientForm.get('code')?.errors && clientForm.get('code')?.touched ? '#ff4757' : '#d9d9d9'"
              [style.background-color]="isEditMode ? '#f5f5f5' : 'white'"
              [style.cursor]="isEditMode ? 'not-allowed' : 'text'">
            <div *ngIf="clientForm.get('code')?.errors && clientForm.get('code')?.touched" 
                 style="color: #ff4757; font-size: 12px; margin-top: 5px;">
              Código é obrigatório
            </div>
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">Nome *</label>
            <input 
              type="text" 
              formControlName="name"
              placeholder="Nome da empresa"
              style="width: 100%; padding: 12px; border: 1px solid #d9d9d9; border-radius: 6px; font-size: 14px;"
              [style.border-color]="clientForm.get('name')?.errors && clientForm.get('name')?.touched ? '#ff4757' : '#d9d9d9'">
            <div *ngIf="clientForm.get('name')?.errors && clientForm.get('name')?.touched" 
                 style="color: #ff4757; font-size: 12px; margin-top: 5px;">
              Nome é obrigatório
            </div>
          </div>

          <div style="margin-bottom: 24px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">Status</label>
            <select 
              formControlName="active"
              style="width: 100%; padding: 12px; border: 1px solid #d9d9d9; border-radius: 6px; font-size: 14px;">
              <option [value]="true">Ativo</option>
              <option [value]="false">Inativo</option>
            </select>
          </div>

          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button 
              type="button" 
              (click)="closeModal()"
              style="background: #f5f5f5; color: #333; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; font-size: 14px;">
              Cancelar
            </button>
            <button 
              type="submit" 
              [disabled]="!clientForm.valid"
              style="background: #52c41a; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; font-size: 14px;"
              [style.background]="!clientForm.valid ? '#d9d9d9' : '#52c41a'">
              {{ isEditMode ? '💾 Salvar' : '➕ Criar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div *ngIf="showDeleteModal" 
         style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1001;"
         (click)="closeDeleteModal()">
      <div style="background: white; padding: 30px; border-radius: 8px; width: 90%; max-width: 400px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); text-align: center;"
           (click)="$event.stopPropagation()">
        
        <div style="font-size: 48px; color: #ff4d4f; margin-bottom: 20px;">⚠️</div>
        
        <h2 style="margin: 0 0 15px 0; color: #333; font-size: 20px;">Confirmar Exclusão</h2>
        
        <p style="margin: 0 0 25px 0; color: #666; line-height: 1.5;">
          Tem certeza que deseja excluir o cliente <br>
          <strong style="color: #333;">"{{ clientToDelete?.name }}"</strong>?
        </p>
        
        <div style="border: 1px solid #ffe7e7; background: #fff2f2; padding: 12px; border-radius: 6px; margin-bottom: 25px;">
          <p style="margin: 0; color: #d32029; font-size: 14px;">
            ⚠️ Esta ação não pode ser desfeita!
          </p>
        </div>
        
        <div style="display: flex; gap: 12px; justify-content: center;">
          <button 
            (click)="closeDeleteModal()"
            style="background: #f5f5f5; color: #333; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 14px; min-width: 100px;">
            Cancelar
          </button>
          <button 
            (click)="confirmDelete()"
            style="background: #ff4d4f; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 14px; min-width: 100px;">
            🗑️ Excluir
          </button>
        </div>
      </div>
    </div>

    <!-- Notifications Container -->
    <div class="notifications-container" style="position: fixed; top: 20px; right: 20px; z-index: 1100; display: flex; flex-direction: column; gap: 10px;">
      <div *ngFor="let notification of notifications" 
           [attr.data-notification-id]="notification.id"
           class="notification"
           [ngClass]="'notification-' + notification.type"
           style="min-width: 300px; max-width: 400px; padding: 16px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 12px; animation: slideInRight 0.3s ease-out; position: relative; overflow: hidden;">
        
        <!-- Icon based on type -->
        <div class="notification-icon" style="font-size: 20px; flex-shrink: 0;">
          <span *ngIf="notification.type === 'success'">✅</span>
          <span *ngIf="notification.type === 'error'">❌</span>
          <span *ngIf="notification.type === 'info'">ℹ️</span>
        </div>
        
        <!-- Message -->
        <div class="notification-message" style="flex: 1; font-size: 14px; font-weight: 500;">
          {{ notification.message }}
        </div>
        
        <!-- Close button -->
        <button (click)="removeNotification(notification.id)"
                style="background: none; border: none; cursor: pointer; font-size: 18px; opacity: 0.7; padding: 0; line-height: 1;"
                onmouseover="this.style.opacity='1'" 
                onmouseout="this.style.opacity='0.7'">
          ×
        </button>
        
        <!-- Progress bar for auto-dismiss -->
        <div class="progress-bar" 
             style="position: absolute; bottom: 0; left: 0; height: 3px; background: rgba(255,255,255,0.3); animation: progressBar 4s linear;">
        </div>
      </div>
    </div>

    <style>
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes progressBar {
        from {
          width: 100%;
        }
        to {
          width: 0%;
        }
      }
      
      .notification-success {
        background: #f6ffed;
        border: 1px solid #b7eb8f;
        color: #52c41a;
      }
      
      .notification-error {
        background: #fff2f0;
        border: 1px solid #ffccc7;
        color: #ff4d4f;
      }
      
      .notification-info {
        background: #e6f7ff;
        border: 1px solid #91d5ff;
        color: #1890ff;
      }
    </style>
  `
})
export class ClientListComponent implements OnInit {
  clientForm: FormGroup;
  showModal = false;
  isEditMode = false;
  editingIndex = -1;
  showDeleteModal = false;
  clientToDelete: Client | null = null;
  deleteIndex = -1;
  notifications: Array<{id: number, message: string, type: 'success' | 'error' | 'info'}> = [];
  clients: Client[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService
  ) {
    this.clientForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      active: [true]
    });
  }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;
    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar clientes:', error);
        this.showNotification('Erro ao carregar clientes', 'error');
        this.isLoading = false;
      }
    });
  }

  getActiveClients(): number {
    return this.clients.filter(client => client.active).length;
  }

  getInactiveClients(): number {
    return this.clients.filter(client => !client.active).length;
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.editingIndex = -1;
    this.clientForm.reset({
      code: '',
      name: '',
      active: true
    });
    this.showModal = true;
  }

  editClient(index: number): void {
    this.isEditMode = true;
    this.editingIndex = index;
    const client = this.clients[index];
    this.clientForm.patchValue({
      code: client.code,
      name: client.name,
      active: client.active
    });
    this.showModal = true;
  }

  deleteClient(index: number): void {
    this.clientToDelete = this.clients[index];
    this.deleteIndex = index;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.clientToDelete) {
      const clientName = this.clientToDelete.name;
      this.clientService.deleteClient(this.clientToDelete.id).subscribe({
        next: () => {
          this.showNotification(`Cliente "${clientName}" excluído com sucesso!`, 'success');
          this.loadClients(); // Reload the list
          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Erro ao excluir cliente:', error);
          this.showNotification('Erro ao excluir cliente', 'error');
          this.closeDeleteModal();
        }
      });
    }
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.clientToDelete = null;
    this.deleteIndex = -1;
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      const formData = this.clientForm.value;
      
      if (this.isEditMode && this.editingIndex >= 0) {
        const client = this.clients[this.editingIndex];
        const updateData: UpdateClientRequest = {
          name: formData.name,
          active: formData.active
        };
        
        this.clientService.updateClient(client.id, updateData).subscribe({
          next: () => {
            this.showNotification(`Cliente "${formData.name}" atualizado com sucesso!`, 'success');
            this.loadClients(); // Reload the list
            this.closeModal();
          },
          error: (error) => {
            console.error('Erro ao atualizar cliente:', error);
            this.showNotification('Erro ao atualizar cliente', 'error');
          }
        });
      } else {
        const createData: CreateClientRequest = {
          code: formData.code,
          name: formData.name
        };
        
        this.clientService.createClient(createData).subscribe({
          next: () => {
            this.showNotification(`Cliente "${formData.name}" criado com sucesso!`, 'success');
            this.loadClients(); // Reload the list
            this.closeModal();
          },
          error: (error) => {
            console.error('Erro ao criar cliente:', error);
            this.showNotification('Erro ao criar cliente', 'error');
          }
        });
      }
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.clientForm.reset();
  }

  showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const id = Date.now();
    this.notifications.push({ id, message, type });
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      this.removeNotification(id);
    }, 4000);
  }

  removeNotification(id: number): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }
}