import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ClientService } from '../../core/services/client.service';
import { Client } from '../../core/models/client.model';

@Component({
    selector: 'app-client-list',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="client-list-container">
      <div class="header">
        <h1>Clientes em Controlado</h1>
      </div>

      <div class="filters">
        <div class="search-box">
          <input 
            type="text" 
            [formControl]="searchControl"
            placeholder="Buscar por código do cliente ou release..."
            class="search-input">
        </div>
        <div class="filter-group">
          <label for="environment-filter">Ambiente:</label>
          <select 
            id="environment-filter" 
            [formControl]="environmentFilter"
            class="filter-select">
            <option value="">Todos</option>
            <option value="homologacao">Homologação</option>
            <option value="producao">Produção</option>
          </select>
        </div>
      </div>

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
                <th (click)="sortBy('environment')" class="sortable">
                  Ambiente
                  @if (sortField() === 'environment') {
                    <span class="sort-icon">
                      {{ sortDirection() === 'asc' ? '▲' : '▼' }}
                    </span>
                  }
                </th>
                <th (click)="sortBy('releaseProduct')" class="sortable">
                  Produto
                  @if (sortField() === 'releaseProduct') {
                    <span class="sort-icon">
                      {{ sortDirection() === 'asc' ? '▲' : '▼' }}
                    </span>
                  }
                </th>
                <th (click)="sortBy('releaseVersion')" class="sortable">
                  Versão
                  @if (sortField() === 'releaseVersion') {
                    <span class="sort-icon">
                      {{ sortDirection() === 'asc' ? '▲' : '▼' }}
                    </span>
                  }
                </th>
                <th>Status da Release</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              @for (client of paginatedClients(); track client.id) {
                <tr>
                  <td>{{ client.clientCode }}</td>
                  <td>
                    <span [class.badge]="true" [class]="'badge-' + client.environment">
                      {{ client.environment }}
                    </span>
                  </td>
                  <td>{{ client.releaseProduct }}</td>
                  <td>{{ client.releaseVersion }}</td>
                  <td>
                    <span [class.status]="true" [class]="'status-' + getStatusClass(client.releaseStatus)">
                      {{ client.releaseStatus }}
                    </span>
                  </td>
                  <td>
                    <button 
                      class="btn btn-sm btn-primary"
                      (click)="viewRelease(client.releaseId)">
                      Ver Release
                    </button>
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
  `]
})
export class ClientListComponent implements OnInit {
  private clientService = inject(ClientService);
  private router = inject(Router);

  // State signals
  loading = signal(true);
  error = signal<string | null>(null);
  clients = signal<Client[]>([]);
  
  // Form controls
  searchControl = new FormControl('');
  environmentFilter = new FormControl('');
  
  // Pagination
  currentPage = signal(1);
  pageSize = 25;
  
  // Sorting
  sortField = signal<keyof Client>('clientCode');
  sortDirection = signal<'asc' | 'desc'>('asc');

  // Computed values
  filteredClients = computed(() => {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    const envFilter = this.environmentFilter.value || '';
    
    return this.clients().filter(client => {
      const matchesSearch = client.clientCode.toLowerCase().includes(searchTerm) ||
                           client.releaseProduct.toLowerCase().includes(searchTerm) ||
                           client.releaseVersion.toLowerCase().includes(searchTerm);
      
      const matchesEnv = !envFilter || client.environment === envFilter;
      
      return matchesSearch && matchesEnv;
    }).sort((a, b) => {
      const field = this.sortField();
      const dir = this.sortDirection() === 'asc' ? 1 : -1;
      
      const aVal = a[field];
      const bVal = b[field];
      
      if (aVal < bVal) return -1 * dir;
      if (aVal > bVal) return 1 * dir;
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
    
    // Watch for environment filter changes
    this.environmentFilter.valueChanges.subscribe(() => {
      this.currentPage.set(1);
    });
  }

  loadClients(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.clientService.getAllControlledClients().subscribe({
      next: (clients) => {
        this.clients.set(clients);
        this.loading.set(false);
      },
      error: (err) => {
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

  getStatusClass(status: string): string {
    if (status.includes('Aprovad')) return 'approved';
    if (status.includes('Falha') || status.includes('Reprovad')) return 'failed';
    if (status.includes('Disponível')) return 'available';
    return 'pending';
  }

  viewRelease(releaseId: string): void {
    this.router.navigate(['/releases', releaseId]);
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
}