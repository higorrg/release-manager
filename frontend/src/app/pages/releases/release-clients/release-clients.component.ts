import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-release-clients',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  template: `<div class="release-clients-container" style="padding: 20px;">
    <!-- Header -->
    <div class="header" style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2 style="margin: 0 0 5px 0; color: #333;">👥 Clientes e Ambientes</h2>
          <p style="margin: 0; color: #666; font-size: 14px;">Release {{ releaseId }} • Gerencie quais clientes podem usar esta release</p>
        </div>
        <button [routerLink]="['/dashboard/releases', releaseId]" 
                style="background: #1890ff; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px;">
          ← Voltar ao Release
        </button>
      </div>
    </div>

    <!-- Add Client Form -->
    <div class="add-client-form" style="background: white; padding: 30px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h3 style="margin: 0 0 20px 0; color: #333;">➕ Adicionar Cliente</h3>
      
      <form [formGroup]="clientForm" (ngSubmit)="addClient()">
        <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 15px; align-items: end;">
          <div class="form-group">
            <label for="clientCode" style="display: block; margin-bottom: 8px; font-weight: 500; color: #555;">Código do Cliente:</label>
            <input id="clientCode" 
                   type="text" 
                   formControlName="clientCode" 
                   placeholder="CLI001, CLI002, etc."
                   style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;"
                   [style.border-color]="isFieldInvalid('clientCode') ? '#ff4757' : '#ddd'">
            <div *ngIf="isFieldInvalid('clientCode')" style="color: #ff4757; font-size: 12px; margin-top: 4px;">
              {{ getFieldError('clientCode') }}
            </div>
          </div>

          <div class="form-group">
            <label for="environment" style="display: block; margin-bottom: 8px; font-weight: 500; color: #555;">Ambiente:</label>
            <select id="environment" 
                    formControlName="environment" 
                    style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px; background: white; box-sizing: border-box;"
                    [style.border-color]="isFieldInvalid('environment') ? '#ff4757' : '#ddd'">
              <option value="">Selecione...</option>
              <option value="homologacao">🧪 Homologação</option>
              <option value="producao">🚀 Produção</option>
            </select>
            <div *ngIf="isFieldInvalid('environment')" style="color: #ff4757; font-size: 12px; margin-top: 4px;">
              {{ getFieldError('environment') }}
            </div>
          </div>

          <div>
            <button type="submit" 
                    [disabled]="clientForm.invalid || isLoading"
                    style="padding: 12px 20px; background: #52c41a; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; white-space: nowrap;"
                    [style.background]="clientForm.invalid || isLoading ? '#ccc' : '#52c41a'"
                    [style.cursor]="clientForm.invalid || isLoading ? 'not-allowed' : 'pointer'">
              <span *ngIf="!isLoading">➕ Adicionar</span>
              <span *ngIf="isLoading">⏳</span>
            </button>
          </div>
        </div>
      </form>

      <div *ngIf="successMessage" style="margin-top: 15px; padding: 12px; background: #e6ffe6; color: #00b894; border-radius: 6px; font-size: 14px;">
        ✅ {{ successMessage }}
      </div>

      <div *ngIf="errorMessage" style="margin-top: 15px; padding: 12px; background: #ffe6e6; color: #d63031; border-radius: 6px; font-size: 14px;">
        ⚠️ {{ errorMessage }}
      </div>
    </div>

    <!-- Client List -->
    <div class="client-list" style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3 style="margin: 0; color: #333;">📋 Clientes Autorizados</h3>
        <div style="font-size: 14px; color: #666;">
          Total: {{ clientAssignments.length }} cliente(s)
        </div>
      </div>

      <div *ngIf="clientAssignments.length > 0" class="assignments-grid" style="display: grid; gap: 15px;">
        <div *ngFor="let assignment of clientAssignments; let i = index" 
             class="assignment-item" 
             style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border: 2px solid #f0f0f0; border-radius: 8px; transition: all 0.2s;"
             onmouseover="this.style.borderColor='#1890ff'; this.style.backgroundColor='#f6ffed';"
             onmouseout="this.style.borderColor='#f0f0f0'; this.style.backgroundColor='white';">
          
          <div class="assignment-info">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
              <span style="font-weight: 500; color: #333; font-size: 16px;">
                {{ assignment.clientCode }}
              </span>
              <span class="environment-badge" 
                    [style.background-color]="getEnvironmentColor(assignment.environment)"
                    style="padding: 4px 8px; border-radius: 12px; color: white; font-size: 11px; font-weight: 500;">
                {{ getEnvironmentText(assignment.environment) }}
              </span>
            </div>
            <div style="font-size: 12px; color: #666;">
              Adicionado por {{ assignment.addedBy }} em {{ formatDate(assignment.createdAt) }}
            </div>
          </div>

          <div class="assignment-actions">
            <button (click)="confirmRemoval(i)" 
                    style="padding: 8px 12px; background: #ff4757; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
              🗑️ Remover
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div *ngIf="clientAssignments.length === 0" 
           style="text-align: center; padding: 60px 20px; color: #666;">
        <div style="font-size: 48px; margin-bottom: 20px;">👥</div>
        <h3 style="color: #666; margin-bottom: 10px;">Nenhum cliente autorizado</h3>
        <p>Use o formulário acima para adicionar clientes que podem usar esta release.</p>
      </div>
    </div>

    <!-- Release Types Info -->
    <div class="release-types-info" style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h4 style="margin: 0 0 15px 0; color: #333;">📚 Tipos de Release</h4>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
        <div style="padding: 15px; background: #f0f9ff; border-left: 4px solid #1890ff; border-radius: 4px;">
          <h5 style="margin: 0 0 8px 0; color: #1890ff;">🔒 Restritivas</h5>
          <p style="margin: 0; font-size: 13px; color: #666;">Apenas clientes específicos listados podem usar a release</p>
        </div>
        
        <div style="padding: 15px; background: #f6ffed; border-left: 4px solid #52c41a; border-radius: 4px;">
          <h5 style="margin: 0 0 8px 0; color: #52c41a;">🌍 Abertas</h5>
          <p style="margin: 0; font-size: 13px; color: #666;">Todos os clientes podem usar (lista vazia = aberta)</p>
        </div>
        
        <div style="padding: 15px; background: #fff7e6; border-left: 4px solid #fa8c16; border-radius: 4px;">
          <h5 style="margin: 0 0 8px 0; color: #fa8c16;">🧪 Homologação vs 🚀 Produção</h5>
          <p style="margin: 0; font-size: 13px; color: #666;">Controle separado por ambiente de execução</p>
        </div>
      </div>
    </div>

    <!-- API Integration Info -->
    <div class="api-info" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px; border: 1px solid #e8e8e8;">
      <h4 style="margin: 0 0 15px 0; color: #333;">🔌 Integração com API</h4>
      <div style="font-family: 'Monaco', 'Courier New', monospace; background: #2d3748; color: #e2e8f0; padding: 15px; border-radius: 4px; font-size: 12px; overflow-x: auto;">
        <div style="color: #68d391; margin-bottom: 5px;">GET /api/v1/releases/{{ releaseId }}/clients</div>
        <div style="color: #fbb6ce;">Response: Lista de clientes autorizados para esta release</div>
        <div style="margin-top: 10px; color: #68d391;">POST /api/v1/releases/{{ releaseId }}/clients</div>
        <div style="color: #fbb6ce;">Body: {"{ clientCode: 'CLI001', environment: 'producao' }"}</div>
      </div>
    </div>
  </div>`
})
export class ReleaseClientsComponent implements OnInit {
  releaseId: string = '';
  clientForm!: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  // Mock client assignments data - implementing US-04
  clientAssignments = [
    {
      id: 1,
      clientCode: 'CLI001',
      environment: 'producao',
      addedBy: 'João Silva',
      createdAt: new Date('2024-01-15T10:30:00')
    },
    {
      id: 2,
      clientCode: 'CLI002',
      environment: 'homologacao',
      addedBy: 'Maria Santos',
      createdAt: new Date('2024-01-15T14:20:00')
    },
    {
      id: 3,
      clientCode: 'CLI003',
      environment: 'producao',
      addedBy: 'Carlos Lima',
      createdAt: new Date('2024-01-16T09:15:00')
    }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.releaseId = this.route.snapshot.params['id'];
    this.initializeForm();
    this.loadClientAssignments();
  }

  private initializeForm(): void {
    this.clientForm = this.fb.group({
      clientCode: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}\d{3}$/)]],
      environment: ['', [Validators.required]]
    });
  }

  private loadClientAssignments(): void {
    // In real implementation, load from backend API
    // GET /api/v1/releases/{releaseId}/clients
  }

  addClient(): void {
    if (this.clientForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const clientData = {
        clientCode: this.clientForm.value.clientCode,
        environment: this.clientForm.value.environment
      };

      // Check for duplicates (US-04 requirement)
      const duplicate = this.clientAssignments.find(assignment => 
        assignment.clientCode === clientData.clientCode && 
        assignment.environment === clientData.environment
      );

      if (duplicate) {
        this.errorMessage = `Cliente ${clientData.clientCode} já está autorizado para o ambiente ${this.getEnvironmentText(clientData.environment)}.`;
        this.isLoading = false;
        return;
      }

      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        
        const newAssignment = {
          id: this.clientAssignments.length + 1,
          clientCode: clientData.clientCode,
          environment: clientData.environment,
          addedBy: 'Usuário Atual',
          createdAt: new Date()
        };

        this.clientAssignments.push(newAssignment);
        this.successMessage = `Cliente ${clientData.clientCode} adicionado com sucesso para ${this.getEnvironmentText(clientData.environment)}!`;
        this.clientForm.reset();

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      }, 500);
    } else {
      this.markFormGroupTouched();
    }
  }

  confirmRemoval(index: number): void {
    const assignment = this.clientAssignments[index];
    const confirmMessage = `Tem certeza que deseja remover o cliente ${assignment.clientCode} do ambiente ${this.getEnvironmentText(assignment.environment)}?`;
    
    if (confirm(confirmMessage)) {
      this.removeClient(index);
    }
  }

  private removeClient(index: number): void {
    const assignment = this.clientAssignments[index];
    
    // Simulate API call
    setTimeout(() => {
      this.clientAssignments.splice(index, 1);
      this.successMessage = `Cliente ${assignment.clientCode} removido com sucesso!`;
      
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    }, 200);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.clientForm.controls).forEach(key => {
      const control = this.clientForm.get(key);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.clientForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.clientForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} é obrigatório`;
      }
      if (field.errors['pattern']) {
        return 'Código deve seguir o padrão CLI001, CLI002, etc.';
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      clientCode: 'Código do cliente',
      environment: 'Ambiente'
    };
    return labels[fieldName] || fieldName;
  }

  getEnvironmentColor(environment: string): string {
    return environment === 'producao' ? '#52c41a' : '#1890ff';
  }

  getEnvironmentText(environment: string): string {
    return environment === 'producao' ? 'Produção' : 'Homologação';
  }

  formatDate(date: Date): string {
    return date.toLocaleString('pt-BR');
  }
}