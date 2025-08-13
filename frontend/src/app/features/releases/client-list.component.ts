import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-list',
  template: `
    <div class="client-list-container">
      <div class="header">
        <h2>Gerenciamento de Clientes</h2>
        <button class="btn btn-primary">Novo Cliente</button>
      </div>

      <div class="coming-soon">
        <div class="icon">🚧</div>
        <h3>Em Desenvolvimento</h3>
        <p>O gerenciamento de clientes e ambientes está sendo desenvolvido.</p>
        <p>Esta funcionalidade estará disponível em breve!</p>
        
        <div class="features-preview">
          <h4>Funcionalidades planejadas:</h4>
          <ul>
            <li>Cadastro de clientes</li>
            <li>Configuração de ambientes (Homologação/Produção)</li>
            <li>Associação de releases a clientes específicos</li>
            <li>Controle de acesso por ambiente</li>
            <li>API para verificação de versões disponíveis</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .client-list-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .header h2 {
      margin: 0;
      color: #2c3e50;
    }

    .btn {
      padding: 10px 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s;
    }

    .btn-primary {
      background: #3498db;
      color: white;
    }

    .btn-primary:hover {
      background: #2980b9;
    }

    .coming-soon {
      text-align: center;
      padding: 60px 40px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border: 1px solid #e1e8ed;
    }

    .icon {
      font-size: 48px;
      margin-bottom: 20px;
    }

    .coming-soon h3 {
      color: #2c3e50;
      margin-bottom: 16px;
      font-size: 24px;
    }

    .coming-soon p {
      color: #6c757d;
      margin-bottom: 12px;
      font-size: 16px;
    }

    .features-preview {
      margin-top: 40px;
      text-align: left;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
      background: #f8f9fa;
      padding: 24px;
      border-radius: 8px;
    }

    .features-preview h4 {
      color: #2c3e50;
      margin-bottom: 16px;
      text-align: center;
    }

    .features-preview ul {
      margin: 0;
      padding-left: 20px;
    }

    .features-preview li {
      color: #495057;
      margin-bottom: 8px;
      line-height: 1.4;
    }
  `],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientListComponent {}