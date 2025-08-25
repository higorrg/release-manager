import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-api-doc',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  template: `<div class="api-doc-container" style="padding: 20px;">
    <!-- Header -->
    <div class="header" style="background: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h1 style="margin: 0 0 10px 0; color: #333; font-size: 32px;">🔌 API Documentation</h1>
      <p style="margin: 0 0 20px 0; color: #666; font-size: 16px;">
        API pública para consulta de releases disponíveis para clientes
      </p>
      
      <div style="display: flex; gap: 15px; flex-wrap: wrap;">
        <div style="padding: 8px 16px; background: #e6f7ff; color: #1890ff; border-radius: 16px; font-size: 14px; font-weight: 500;">
          📚 REST API
        </div>
        <div style="padding: 8px 16px; background: #f6ffed; color: #52c41a; border-radius: 16px; font-size: 14px; font-weight: 500;">
          🔒 Autenticada
        </div>
        <div style="padding: 8px 16px; background: #fff7e6; color: #fa8c16; border-radius: 16px; font-size: 14px; font-weight: 500;">
          🚀 Versionada
        </div>
      </div>
    </div>

    <!-- Base URL -->
    <div class="base-url" style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h3 style="margin: 0 0 15px 0; color: #333;">🌐 URL Base</h3>
      <div style="font-family: 'Monaco', 'Courier New', monospace; background: #2d3748; color: #e2e8f0; padding: 15px; border-radius: 4px; font-size: 14px;">
        https://api.releasemanager.empresa.com.br/v1
      </div>
    </div>

    <!-- Authentication -->
    <div class="authentication" style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h3 style="margin: 0 0 15px 0; color: #333;">🔐 Autenticação</h3>
      <p style="margin-bottom: 15px; color: #666;">
        Todas as requisições devem incluir o token de acesso no header:
      </p>
      <div style="font-family: 'Monaco', 'Courier New', monospace; background: #2d3748; color: #e2e8f0; padding: 15px; border-radius: 4px; font-size: 12px; margin-bottom: 15px;">
        <div style="color: #68d391;">Authorization: Bearer &lt;seu-token-aqui&gt;</div>
        <div style="color: #fbb6ce;">Content-Type: application/json</div>
      </div>
      <div style="background: #fff7e6; padding: 15px; border-radius: 4px; border-left: 4px solid #fa8c16;">
        <strong style="color: #fa8c16;">💡 Nota:</strong> Entre em contato com a equipe de DevOps para obter seu token de acesso.
      </div>
    </div>

    <!-- Main API Endpoints -->
    <div class="endpoints" style="display: grid; gap: 25px;">
      
      <!-- Get Available Releases -->
      <div class="endpoint" style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
          <span style="padding: 6px 12px; background: #52c41a; color: white; border-radius: 4px; font-weight: 500; font-size: 12px;">GET</span>
          <h4 style="margin: 0; color: #333; font-size: 18px;">/releases/available</h4>
        </div>
        
        <p style="margin-bottom: 20px; color: #666;">
          <strong>US-06:</strong> Consulta releases disponíveis para um cliente específico em um ambiente.
        </p>

        <div class="request-params" style="margin-bottom: 20px;">
          <h5 style="margin: 0 0 10px 0; color: #333;">Query Parameters:</h5>
          <div style="font-family: 'Monaco', 'Courier New', monospace; background: #f8f9fa; padding: 15px; border-radius: 4px; font-size: 12px; border: 1px solid #e8e8e8;">
            <div style="margin-bottom: 8px;"><span style="color: #e74c3c;">clientCode*</span> <span style="color: #666;">(string)</span> - Código do cliente (ex: CLI001)</div>
            <div style="margin-bottom: 8px;"><span style="color: #e74c3c;">environment*</span> <span style="color: #666;">(string)</span> - Ambiente: producao | homologacao</div>
            <div><span style="color: #2980b9;">includePrerequisites</span> <span style="color: #666;">(boolean)</span> - Incluir pré-requisitos (opcional)</div>
          </div>
        </div>

        <div class="request-example" style="margin-bottom: 20px;">
          <h5 style="margin: 0 0 10px 0; color: #333;">Exemplo de Requisição:</h5>
          <div style="font-family: 'Monaco', 'Courier New', monospace; background: #2d3748; color: #e2e8f0; padding: 15px; border-radius: 4px; font-size: 12px;">
            <div style="color: #68d391;">GET /v1/releases/available?clientCode=CLI001&environment=producao</div>
            <div style="color: #fbb6ce;">Authorization: Bearer eyJhbGciOiJSUzI1NiIs...</div>
          </div>
        </div>

        <div class="response-example">
          <h5 style="margin: 0 0 10px 0; color: #333;">Resposta (200 OK):</h5>
          <div style="font-family: 'Monaco', 'Courier New', monospace; background: #2d3748; color: #e2e8f0; padding: 15px; border-radius: 4px; font-size: 11px; overflow-x: auto;">
            <pre style="margin: 0; color: inherit;">{
  "client": {
    "code": "CLI001",
    "environment": "producao"
  },
  "releases": [
    {
      "version": "1.2.3",
      "product": "Sistema Principal",
      "status": "AVAILABLE",
      "releaseNotes": "Correções de bugs e melhorias de performance...",
      "prerequisites": [
        "Java 21+",
        "PostgreSQL 17+",
        "Mínimo 4GB RAM"
      ],
      "downloadUrl": "https://cdn.empresa.com.br/releases/sistema-1.2.3.zip",
      "checksum": "sha256:a1b2c3d4e5f6...",
      "size": "245MB",
      "releaseDate": "2024-01-15T10:30:00Z"
    }
  ],
  "metadata": {
    "totalReleases": 1,
    "lastUpdate": "2024-01-16T14:20:00Z"
  }
}</pre>
          </div>
        </div>
      </div>

      <!-- Get Release Details -->
      <div class="endpoint" style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
          <span style="padding: 6px 12px; background: #52c41a; color: white; border-radius: 4px; font-weight: 500; font-size: 12px;">GET</span>
          <h4 style="margin: 0; color: #333; font-size: 18px;">/releases/{version}</h4>
        </div>
        
        <p style="margin-bottom: 20px; color: #666;">
          Obtém detalhes completos de uma release específica, incluindo release notes e pré-requisitos.
        </p>

        <div class="path-params" style="margin-bottom: 20px;">
          <h5 style="margin: 0 0 10px 0; color: #333;">Path Parameters:</h5>
          <div style="font-family: 'Monaco', 'Courier New', monospace; background: #f8f9fa; padding: 15px; border-radius: 4px; font-size: 12px; border: 1px solid #e8e8e8;">
            <div><span style="color: #e74c3c;">version*</span> <span style="color: #666;">(string)</span> - Versão da release (ex: 1.2.3)</div>
          </div>
        </div>

        <div class="request-example" style="margin-bottom: 20px;">
          <h5 style="margin: 0 0 10px 0; color: #333;">Exemplo de Requisição:</h5>
          <div style="font-family: 'Monaco', 'Courier New', monospace; background: #2d3748; color: #e2e8f0; padding: 15px; border-radius: 4px; font-size: 12px;">
            <div style="color: #68d391;">GET /v1/releases/1.2.3</div>
            <div style="color: #fbb6ce;">Authorization: Bearer eyJhbGciOiJSUzI1NiIs...</div>
          </div>
        </div>
      </div>

      <!-- Pipeline Integration -->
      <div class="endpoint" style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
          <span style="padding: 6px 12px; background: #1890ff; color: white; border-radius: 4px; font-weight: 500; font-size: 12px;">POST</span>
          <h4 style="margin: 0; color: #333; font-size: 18px;">/releases</h4>
        </div>
        
        <p style="margin-bottom: 20px; color: #666;">
          <strong>US-05:</strong> Endpoint para integração com pipeline CI/CD. Registra uma nova release automaticamente.
        </p>

        <div class="request-body" style="margin-bottom: 20px;">
          <h5 style="margin: 0 0 10px 0; color: #333;">Request Body:</h5>
          <div style="font-family: 'Monaco', 'Courier New', monospace; background: #2d3748; color: #e2e8f0; padding: 15px; border-radius: 4px; font-size: 11px;">
            <pre style="margin: 0; color: inherit;">{
  "product": "Sistema Principal",
  "version": "1.2.4",
  "branch": "release/1.2.4",
  "commitHash": "a1b2c3d4e5f6789...",
  "releaseType": "patch",
  "metadata": {
    "mrId": "1234",
    "approvedBy": "joao.silva@empresa.com.br",
    "buildNumber": "2024.15.001"
  }
}</pre>
          </div>
        </div>
      </div>

      <!-- Download Package -->
      <div class="endpoint" style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
          <span style="padding: 6px 12px; background: #52c41a; color: white; border-radius: 4px; font-weight: 500; font-size: 12px;">GET</span>
          <h4 style="margin: 0; color: #333; font-size: 18px;">/releases/{version}/download</h4>
        </div>
        
        <p style="margin-bottom: 20px; color: #666;">
          <strong>US-07:</strong> Download seguro de pacotes de distribuição. URL temporária com controle de acesso.
        </p>

        <div class="security-note" style="background: #fff2e8; padding: 15px; border-radius: 4px; border-left: 4px solid #fa8c16; margin-bottom: 15px;">
          <strong style="color: #fa8c16;">🔒 Segurança:</strong> 
          URLs de download são temporárias (válidas por 1 hora) e controladas por permissão de cliente.
        </div>
      </div>
    </div>

    <!-- Error Responses -->
    <div class="error-responses" style="background: white; padding: 25px; border-radius: 8px; margin-top: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h3 style="margin: 0 0 20px 0; color: #333;">⚠️ Códigos de Erro Comuns</h3>
      
      <div style="display: grid; gap: 15px;">
        <div style="padding: 15px; background: #fff2f0; border-left: 4px solid #ff4d4f; border-radius: 4px;">
          <div style="font-weight: 500; color: #ff4d4f; margin-bottom: 5px;">401 Unauthorized</div>
          <div style="color: #666; font-size: 14px;">Token inválido ou expirado</div>
        </div>
        
        <div style="padding: 15px; background: #fff2f0; border-left: 4px solid #ff4d4f; border-radius: 4px;">
          <div style="font-weight: 500; color: #ff4d4f; margin-bottom: 5px;">403 Forbidden</div>
          <div style="color: #666; font-size: 14px;">Cliente não autorizado para a release solicitada</div>
        </div>
        
        <div style="padding: 15px; background: #fff2f0; border-left: 4px solid #ff4d4f; border-radius: 4px;">
          <div style="font-weight: 500; color: #ff4d4f; margin-bottom: 5px;">404 Not Found</div>
          <div style="color: #666; font-size: 14px;">Release não encontrada ou não disponível</div>
        </div>
        
        <div style="padding: 15px; background: #fff7e6; border-left: 4px solid #fa8c16; border-radius: 4px;">
          <div style="font-weight: 500; color: #fa8c16; margin-bottom: 5px;">429 Rate Limited</div>
          <div style="color: #666; font-size: 14px;">Muitas requisições - limite: 100 req/min por cliente</div>
        </div>
      </div>
    </div>

    <!-- SDK Examples -->
    <div class="sdk-examples" style="background: white; padding: 25px; border-radius: 8px; margin-top: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h3 style="margin: 0 0 20px 0; color: #333;">💻 Exemplos de Integração</h3>
      
      <div style="margin-bottom: 25px;">
        <h4 style="margin: 0 0 10px 0; color: #333;">🐍 Python</h4>
        <div style="font-family: 'Monaco', 'Courier New', monospace; background: #2d3748; color: #e2e8f0; padding: 15px; border-radius: 4px; font-size: 11px; overflow-x: auto;">
          <pre style="margin: 0; color: inherit;">import requests

def get_available_releases(client_code, environment, token):
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    params = {
        'clientCode': client_code,
        'environment': environment
    }
    
    response = requests.get(
        'https://api.releasemanager.empresa.com.br/v1/releases/available',
        headers=headers,
        params=params
    )
    
    return response.json()</pre>
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <h4 style="margin: 0 0 10px 0; color: #333;">☕ Java</h4>
        <div style="font-family: 'Monaco', 'Courier New', monospace; background: #2d3748; color: #e2e8f0; padding: 15px; border-radius: 4px; font-size: 11px; overflow-x: auto;">
          <pre style="margin: 0; color: inherit;">// Using RestTemplate (Spring)
RestTemplate restTemplate = new RestTemplate();
HttpHeaders headers = new HttpHeaders();
headers.set("Authorization", "Bearer " + token);

String url = "https://api.releasemanager.empresa.com.br/v1/releases/available"
    + "?clientCode={clientCode}&environment={environment}";

HttpEntity<?> entity = new HttpEntity<>(headers);
ResponseEntity<String> response = restTemplate.exchange(
    url, HttpMethod.GET, entity, String.class, clientCode, environment
);</pre>
        </div>
      </div>

      <div>
        <h4 style="margin: 0 0 10px 0; color: #333;">🌐 JavaScript/Node.js</h4>
        <div style="font-family: 'Monaco', 'Courier New', monospace; background: #2d3748; color: #e2e8f0; padding: 15px; border-radius: 4px; font-size: 11px; overflow-x: auto;">
          <pre style="margin: 0; color: inherit;">async function getAvailableReleases(clientCode, environment, token) {
    const response = await fetch(
        \`https://api.releasemanager.empresa.com.br/v1/releases/available?clientCode=\${clientCode}&environment=\${environment}\`,
        {
            headers: {
                'Authorization': \`Bearer \${token}\`,
                'Content-Type': 'application/json'
            }
        }
    );
    
    return await response.json();
}</pre>
        </div>
      </div>
    </div>

    <!-- Support -->
    <div class="support" style="background: #f6ffed; padding: 25px; border-radius: 8px; margin-top: 25px; border: 1px solid #b7eb8f;">
      <h3 style="margin: 0 0 15px 0; color: #52c41a;">💬 Suporte</h3>
      <p style="margin-bottom: 10px; color: #666;">
        Para dúvidas sobre a API ou solicitação de tokens de acesso, entre em contato:
      </p>
      <ul style="margin: 0; padding-left: 20px; color: #666;">
        <li>📧 Email: <strong>api-support@empresa.com.br</strong></li>
        <li>💬 Slack: <strong>#release-manager-api</strong></li>
        <li>📋 Issues: <strong>GitHub Enterprise</strong></li>
      </ul>
    </div>
  </div>`
})
export class ApiDocComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
    // Component initialization
  }

}