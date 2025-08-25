import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  template: `<div class="client-list-container" style="padding: 20px;">
    <!-- Header -->
    <div class="header" style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h2 style="margin: 0 0 10px 0; color: #333;">👥 Gestão de Clientes</h2>
      <p style="margin: 0; color: #666;">Visualize todos os clientes e seus ambientes configurados</p>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
      <div class="stat-card" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 32px; color: #1890ff; margin-bottom: 10px;">👥</div>
        <h3 style="margin: 0; font-size: 24px; color: #333;">{{ getTotalClients() }}</h3>
        <p style="margin: 5px 0 0 0; color: #666;">Total de Clientes</p>
      </div>

      <div class="stat-card" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 32px; color: #52c41a; margin-bottom: 10px;">🚀</div>
        <h3 style="margin: 0; font-size: 24px; color: #333;">{{ getProductionClients() }}</h3>
        <p style="margin: 5px 0 0 0; color: #666;">Em Produção</p>
      </div>

      <div class="stat-card" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 32px; color: #1890ff; margin-bottom: 10px;">🧪</div>
        <h3 style="margin: 0; font-size: 24px; color: #333;">{{ getHomologationClients() }}</h3>
        <p style="margin: 5px 0 0 0; color: #666;">Em Homologação</p>
      </div>

      <div class="stat-card" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 32px; color: #722ed1; margin-bottom: 10px;">📋</div>
        <h3 style="margin: 0; font-size: 24px; color: #333;">{{ getActiveAssignments() }}</h3>
        <p style="margin: 5px 0 0 0; color: #666;">Atribuições Ativas</p>
      </div>
    </div>

    <!-- Client List -->
    <div class="clients-grid" style="display: grid; gap: 20px;">
      <div *ngFor="let client of clients" 
           class="client-card" 
           style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
          <div>
            <h3 style="margin: 0 0 5px 0; color: #333; font-size: 20px;">{{ client.code }}</h3>
            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">{{ client.name }}</p>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <span *ngFor="let env of client.environments" 
                    class="env-badge" 
                    [style.background-color]="getEnvironmentColor(env)"
                    style="padding: 4px 8px; border-radius: 12px; color: white; font-size: 11px; font-weight: 500;">
                {{ getEnvironmentText(env) }}
              </span>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">Última Atualização</div>
            <div style="font-size: 14px; color: #333; font-weight: 500;">{{ formatDate(client.lastUpdate) }}</div>
          </div>
        </div>

        <div class="client-details" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 6px;">
          <div>
            <label style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Tipo</label>
            <p style="margin: 3px 0 0 0; font-weight: 500; color: #333;">{{ client.type }}</p>
          </div>
          <div>
            <label style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Status</label>
            <p style="margin: 3px 0 0 0; font-weight: 500; color: #333;">
              <span [style.color]="getStatusColor(client.status)">{{ client.status }}</span>
            </p>
          </div>
          <div>
            <label style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Releases Ativas</label>
            <p style="margin: 3px 0 0 0; font-weight: 500; color: #333;">{{ client.activeReleases }}</p>
          </div>
          <div>
            <label style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Contato</label>
            <p style="margin: 3px 0 0 0; font-weight: 500; color: #333;">{{ client.contact }}</p>
          </div>
        </div>

        <div class="recent-releases" style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #333; font-size: 14px;">📦 Releases Recentes</h4>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <span *ngFor="let release of client.recentReleases" 
                  style="padding: 4px 8px; background: #e6f7ff; color: #1890ff; border-radius: 4px; font-size: 12px; font-weight: 500;">
              v{{ release }}
            </span>
          </div>
        </div>

        <div class="actions" style="display: flex; gap: 10px; border-top: 1px solid #f0f0f0; padding-top: 15px;">
          <button style="flex: 1; padding: 10px; background: #1890ff; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
            📊 Ver Releases
          </button>
          <button style="flex: 1; padding: 10px; background: #52c41a; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
            🔧 Configurar
          </button>
          <button style="flex: 1; padding: 10px; background: #722ed1; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
            📈 Histórico
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div *ngIf="clients.length === 0" style="text-align: center; padding: 60px 20px; color: #666; background: white; border-radius: 8px;">
      <div style="font-size: 48px; margin-bottom: 20px;">👥</div>
      <h3 style="color: #666; margin-bottom: 10px;">Nenhum cliente encontrado</h3>
      <p>Os clientes serão listados automaticamente conforme as atribuições de releases.</p>
    </div>

    <!-- API Info -->
    <div class="api-integration" style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h4 style="margin: 0 0 15px 0; color: #333;">🔌 API para Consulta de Clientes</h4>
      <p style="margin-bottom: 15px; color: #666; font-size: 14px;">
        Os clientes podem usar esta API para verificar suas releases disponíveis:
      </p>
      <div style="font-family: 'Monaco', 'Courier New', monospace; background: #2d3748; color: #e2e8f0; padding: 15px; border-radius: 4px; font-size: 12px; overflow-x: auto;">
        <div style="color: #68d391; margin-bottom: 5px;">GET /api/v1/clients/{clientCode}/releases?environment=producao</div>
        <div style="color: #fbb6ce;">Retorna: releases disponíveis para o cliente específico</div>
        <div style="margin-top: 10px; color: #68d391;">GET /api/v1/releases?client={clientCode}&environment={env}</div>
        <div style="color: #fbb6ce;">Filtro: releases por cliente e ambiente</div>
      </div>
    </div>
  </div>`
})
export class ClientListComponent implements OnInit {
  
  // Mock client data derived from release assignments
  clients = [
    {
      code: 'CLI001',
      name: 'Empresa Premium LTDA',
      type: 'Corporativo',
      status: 'Ativo',
      environments: ['producao', 'homologacao'],
      activeReleases: 3,
      contact: 'contato@premium.com.br',
      lastUpdate: new Date('2024-01-16T14:30:00'),
      recentReleases: ['1.2.3', '1.2.2', '1.1.5']
    },
    {
      code: 'CLI002',
      name: 'StartUp Inovadora',
      type: 'Startup',
      status: 'Ativo',
      environments: ['homologacao'],
      activeReleases: 1,
      contact: 'dev@startup.com.br',
      lastUpdate: new Date('2024-01-15T16:20:00'),
      recentReleases: ['1.2.3-beta', '1.2.1']
    },
    {
      code: 'CLI003',
      name: 'Corporação Industrial',
      type: 'Enterprise',
      status: 'Ativo',
      environments: ['producao'],
      activeReleases: 5,
      contact: 'ti@corporacao.com.br',
      lastUpdate: new Date('2024-01-16T11:45:00'),
      recentReleases: ['1.2.3', '1.2.2', '1.2.1', '1.1.8']
    },
    {
      code: 'CLI004',
      name: 'Cliente Teste',
      type: 'Parceiro',
      status: 'Inativo',
      environments: ['homologacao'],
      activeReleases: 0,
      contact: 'teste@parceiro.com.br',
      lastUpdate: new Date('2024-01-10T09:15:00'),
      recentReleases: ['1.1.9']
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // In real implementation, load clients from backend API
  }

  getTotalClients(): number {
    return this.clients.length;
  }

  getProductionClients(): number {
    return this.clients.filter(client => 
      client.environments.includes('producao')
    ).length;
  }

  getHomologationClients(): number {
    return this.clients.filter(client => 
      client.environments.includes('homologacao')
    ).length;
  }

  getActiveAssignments(): number {
    return this.clients.reduce((total, client) => total + client.activeReleases, 0);
  }

  getEnvironmentColor(environment: string): string {
    return environment === 'producao' ? '#52c41a' : '#1890ff';
  }

  getEnvironmentText(environment: string): string {
    return environment === 'producao' ? 'Produção' : 'Homologação';
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'Ativo': '#52c41a',
      'Inativo': '#ff4d4f',
      'Suspenso': '#fa8c16'
    };
    return colors[status] || '#d9d9d9';
  }

  formatDate(date: Date): string {
    return date.toLocaleString('pt-BR');
  }
}