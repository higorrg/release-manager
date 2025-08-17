import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ClientService, Client, CreateClientRequest, UpdateClientRequest } from '../../core/services/client.service';
import { ConfirmationService } from '../../shared/services/confirmation.service';

@Component({
    selector: 'app-client-list',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="client-list-container">
      <div class="header">
        <h1>Clientes Cadastrados</h1>
        <button class="btn btn-primary" (click)="openCreateForm()">
          Novo Cliente
        </button>
      </div>

      <div class="filters">
        <div class="search-box">
          <input 
            type="text" 
            [formControl]="searchControl"
            placeholder="Buscar por código ou nome do cliente..."
            class="search-input">
        </div>
      </div>

      @if (showForm()) {
        <div class="form-overlay" (click)="closeForm()">
          <div class="form-modal" (click)="$event.stopPropagation()">
            <h2>{{ isEditing() ? 'Editar Cliente' : 'Novo Cliente' }}</h2>
            <form [formGroup]="clientForm" (ngSubmit)="saveClient()">
              @if (!isEditing()) {
                <div class="form-group">
                  <label for="clientCode">Código do Cliente:</label>
                  <input 
                    id="clientCode" 
                    type="text" 
                    formControlName="clientCode" 
                    class="form-control"
                    placeholder="Ex: CLI001">
                </div>
              }
              <div class="form-group">
                <label for="name">Nome:</label>
                <input 
                  id="name" 
                  type="text" 
                  formControlName="name" 
                  class="form-control"
                  placeholder="Nome do cliente">
              </div>
              <div class="form-group">
                <label for="description">Descrição:</label>
                <textarea 
                  id="description" 
                  formControlName="description" 
                  class="form-control"
                  rows="3"
                  placeholder="Descrição do cliente (opcional)">
                </textarea>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-secondary" (click)="closeForm()">
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary" 
                  [disabled]="!clientForm.valid || submitting()">
                  {{ submitting() ? 'Salvando...' : (isEditing() ? 'Atualizar' : 'Criar') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      @if (loading()) {
        <div class="loading">Carregando clientes...</div>
      } @else if (error()) {
        <div class="error">
          <p>{{ error() }}</p>
          <button class="btn btn-primary" (click)="loadClients()">Tentar Novamente</button>
        </div>
      } @else if (filteredClients().length === 0) {
        <div class="empty-state">
          <p>Nenhum cliente encontrado.</p>
        </div>
      } @else {
        <div class="table-container">
          <table class="clients-table">
            <thead>
              <tr>
                <th (click)="sortBy('clientCode')" class="sortable">
                  Código do Cliente
                  @if (sortField() === 'clientCode') {
                    <span class="sort-icon">
                      {{ sortDirection() === 'asc' ? '▲' : '▼' }}
                    </span>
                  }
                </th>
                <th (click)="sortBy('name')" class="sortable">
                  Nome
                  @if (sortField() === 'name') {
                    <span class="sort-icon">
                      {{ sortDirection() === 'asc' ? '▲' : '▼' }}
                    </span>
                  }
                </th>
                <th>Descrição</th>
                <th>Data de Criação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              @for (client of paginatedClients(); track client.id) {
                <tr>
                  <td>{{ client.clientCode }}</td>
                  <td>{{ client.name }}</td>
                  <td>{{ client.description || '-' }}</td>
                  <td>{{ formatDate(client.createdAt) }}</td>
                  <td>
                    <div class="action-buttons">
                      <button 
                        class="btn btn-sm btn-secondary" 
                        (click)="editClient(client)"
                        title="Editar">
                        ✏️
                      </button>
                      <button 
                        class="btn btn-sm btn-danger" 
                        (click)="confirmDelete(client)"
                        title="Excluir">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="pagination">
          <div class="pagination-info">
            Mostrando {{ paginationInfo() }}
          </div>
          <div class="pagination-controls">
            <button 
              class="btn btn-sm"
              (click)="previousPage()"
              [disabled]="currentPage() === 1">
              Anterior
            </button>
            <span class="page-number">
              Página {{ currentPage() }} de {{ totalPages() }}
            </span>
            <button 
              class="btn btn-sm"
              (click)="nextPage()"
              [disabled]="currentPage() === totalPages()">
              Próxima
            </button>
          </div>
        </div>
      }
    </div>
  `,
    styles: [`
    .client-list-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 30px;
    }

    .header h1 {
      margin: 0;
      color: #333;
    }

    .filters {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .search-box {
      flex: 1;
    }

    .search-input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 14px;
    }

    .search-input:focus {
      outline: none;
      border-color: #80bdff;
      box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .filter-group label {
      font-weight: 500;
      color: #495057;
    }

    .filter-select {
      padding: 10px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 14px;
      min-width: 150px;
    }

    .loading, .error, .empty-state {
      text-align: center;
      padding: 40px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .error {
      color: #dc3545;
    }

    .error p {
      margin-bottom: 20px;
    }

    .table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .clients-table {
      width: 100%;
      border-collapse: collapse;
    }

    .clients-table th,
    .clients-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #dee2e6;
    }

    .clients-table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #495057;
      user-select: none;
    }

    .clients-table th.sortable {
      cursor: pointer;
      position: relative;
    }

    .clients-table th.sortable:hover {
      background: #e9ecef;
    }

    .sort-icon {
      margin-left: 5px;
      font-size: 12px;
      color: #007bff;
    }

    .clients-table tr:hover {
      background: #f8f9fa;
    }

    .badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .badge-homologacao {
      background: #fff3cd;
      color: #856404;
    }

    .badge-producao {
      background: #d1ecf1;
      color: #0c5460;
    }

    .status {
      padding: 4px 12px;
      border-radius: 4px;
      font-weight: 500;
      display: inline-block;
      font-size: 13px;
    }

    .status-approved {
      background: #d4edda;
      color: #155724;
    }

    .status-pending {
      background: #fff3cd;
      color: #856404;
    }

    .status-failed {
      background: #f8d7da;
      color: #721c24;
    }

    .status-available {
      background: #cce5ff;
      color: #004085;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #0056b3;
    }

    .btn-sm {
      padding: 6px 12px;
      font-size: 13px;
    }

    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      padding: 15px 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .pagination-info {
      color: #6c757d;
      font-size: 14px;
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .page-number {
      color: #495057;
      font-weight: 500;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #0056b3;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #5a6268;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background: #c82333;
    }

    .btn-sm {
      padding: 4px 8px;
      font-size: 12px;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .form-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .form-modal {
      background: white;
      padding: 30px;
      border-radius: 8px;
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .form-modal h2 {
      margin-top: 0;
      margin-bottom: 20px;
      color: #333;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #495057;
    }

    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }

    .form-control:focus {
      outline: none;
      border-color: #80bdff;
      box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
    }

    .form-control:disabled {
      background-color: #e9ecef;
      opacity: 1;
    }

    textarea.form-control {
      resize: vertical;
      font-family: inherit;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 30px;
    }
  `]
})
export class ClientListComponent implements OnInit {
  private clientService = inject(ClientService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private confirmationService = inject(ConfirmationService);

  // State signals
  loading = signal(true);
  error = signal<string | null>(null);
  clients = signal<Client[]>([]);
  showForm = signal(false);
  isEditing = signal(false);
  submitting = signal(false);
  editingClient = signal<Client | null>(null);
  
  // Form controls
  searchControl = new FormControl('');
  clientForm: FormGroup;
  
  constructor() {
    this.clientForm = this.fb.group({
      clientCode: ['', [Validators.required, Validators.maxLength(50)]],
      name: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', Validators.maxLength(500)]
    });
  }
  
  // Pagination
  currentPage = signal(1);
  pageSize = 25;
  
  // Sorting
  sortField = signal<keyof Client>('clientCode');
  sortDirection = signal<'asc' | 'desc'>('asc');

  // Computed values
  filteredClients = computed(() => {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    
    return this.clients().filter(client => {
      const matchesSearch = client.clientCode.toLowerCase().includes(searchTerm) ||
                           client.name.toLowerCase().includes(searchTerm);
      
      return matchesSearch;
    }).sort((a, b) => {
      const field = this.sortField();
      const dir = this.sortDirection() === 'asc' ? 1 : -1;
      
      const aVal = a[field];
      const bVal = b[field];
      
      if (aVal && bVal) {
        if (aVal < bVal) return -1 * dir;
        if (aVal > bVal) return 1 * dir;
      }
      return 0;
    });
  });

  paginatedClients = computed(() => {
    const filtered = this.filteredClients();
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return filtered.slice(start, end);
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredClients().length / this.pageSize);
  });

  paginationInfo = computed(() => {
    const total = this.filteredClients().length;
    const start = (this.currentPage() - 1) * this.pageSize + 1;
    const end = Math.min(start + this.pageSize - 1, total);
    return `${start}-${end} de ${total} clientes`;
  });

  ngOnInit(): void {
    this.loadClients();
    
    // Watch for search changes
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage.set(1);
      });
  }

  loadClients(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.clientService.getAllClients().subscribe({
      next: (clients: Client[]) => {
        this.clients.set(clients);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.error.set('Erro ao carregar clientes: ' + err.message);
        this.loading.set(false);
      }
    });
  }

  sortBy(field: keyof Client): void {
    if (this.sortField() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
  }

  formatDate(date: string | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleString('pt-BR');
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  // CRUD methods
  openCreateForm(): void {
    this.isEditing.set(false);
    this.editingClient.set(null);
    this.clientForm.reset();
    this.clientForm.get('clientCode')?.enable();
    this.showForm.set(true);
  }

  editClient(client: Client): void {
    this.isEditing.set(true);
    this.editingClient.set(client);
    this.clientForm.patchValue({
      clientCode: client.clientCode,
      name: client.name,
      description: client.description || ''
    });
    this.clientForm.get('clientCode')?.disable();
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.isEditing.set(false);
    this.editingClient.set(null);
    this.clientForm.reset();
    this.error.set(null);
  }

  saveClient(): void {
    if (!this.clientForm.valid) return;

    this.submitting.set(true);
    this.error.set(null);

    const formValue = this.clientForm.value;

    if (this.isEditing()) {
      const updateRequest: UpdateClientRequest = {
        name: formValue.name,
        description: formValue.description || undefined
      };

      this.clientService.updateClient(this.editingClient()!.id, updateRequest).subscribe({
        next: (updatedClient) => {
          const currentClients = this.clients();
          const index = currentClients.findIndex(c => c.id === updatedClient.id);
          if (index !== -1) {
            currentClients[index] = updatedClient;
            this.clients.set([...currentClients]);
          }
          this.closeForm();
          this.submitting.set(false);
        },
        error: (err) => {
          const errorMessage = err.error?.message || err.message || 'Erro desconhecido';
          this.error.set('Erro ao atualizar cliente: ' + errorMessage);
          this.submitting.set(false);
        }
      });
    } else {
      const createRequest: CreateClientRequest = {
        clientCode: formValue.clientCode,
        name: formValue.name,
        description: formValue.description || undefined
      };

      this.clientService.createClient(createRequest).subscribe({
        next: (newClient) => {
          const currentClients = this.clients();
          this.clients.set([newClient, ...currentClients]);
          this.closeForm();
          this.submitting.set(false);
        },
        error: (err) => {
          const errorMessage = err.error?.message || err.message || 'Erro desconhecido';
          this.error.set('Erro ao criar cliente: ' + errorMessage);
          this.submitting.set(false);
        }
      });
    }
  }

  async confirmDelete(client: Client): Promise<void> {
    const confirmed = await this.confirmationService.confirmDelete(client.name, 'cliente');
    if (confirmed) {
      this.deleteClient(client);
    }
  }

  deleteClient(client: Client): void {
    this.clientService.deleteClient(client.id).subscribe({
      next: () => {
        const currentClients = this.clients();
        this.clients.set(currentClients.filter(c => c.id !== client.id));
      },
      error: (err) => {
        const errorMessage = err.error?.message || err.message || 'Erro desconhecido';
        this.error.set('Erro ao excluir cliente: ' + errorMessage);
      }
    });
  }
}