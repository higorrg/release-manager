# Release Manager API Integration Examples

## Authentication

All API calls (except public client endpoints) require authentication via Bearer token from Keycloak.

```bash
# Get token from Keycloak
TOKEN=$(curl -X POST "http://keycloak:8080/realms/releasemanager/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=release-manager-backend" \
  -d "client_secret=your-client-secret" | jq -r '.access_token')
```

## Pipeline Integration

### 1. Register New Release (Pipeline)

```bash
curl -X POST "http://release-manager:8080/api/releases" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "productName": "Sistema Principal",
    "version": "1.5.0",
    "versionType": "SERVICE_PACK",
    "branchName": "release/1.5.0",
    "commitHash": "abc123456789"
  }'
```

### 2. Update Release Status

```bash
# Mark as ready for system testing
curl -X PUT "http://release-manager:8080/api/releases/1/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "newStatus": "PARA_TESTE_SISTEMA",
    "reason": "Build completed successfully"
  }'
```

### 3. Upload Package

```bash
curl -X POST "http://release-manager:8080/api/packages/upload/Sistema%20Principal/1.5.0" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@sistema-principal-1.5.0.tar.gz" \
  -F "fileName=sistema-principal-1.5.0.tar.gz" \
  -F "fileSize=1048576"
```

## QA Team Integration

### 4. Get Releases for Testing

```bash
# Get all releases ready for system testing
curl -X GET "http://release-manager:8080/api/releases/status/PARA_TESTE_SISTEMA" \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Update Test Results

```bash
# Mark as approved in testing
curl -X PUT "http://release-manager:8080/api/releases/1/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "newStatus": "APROVADA_TESTE",
    "reason": "All system tests passed successfully"
  }'
```

## Client Integration

### 6. Check Available Versions (Public API)

```bash
# Check versions available for client EMPRESA_A in production
curl -X GET "http://release-manager:8080/api/releases/client/EMPRESA_A/environment/PRODUCAO"
```

Response:
```json
[
  {
    "productName": "Sistema Principal",
    "version": "1.4.0",
    "versionType": "SERVICE_PACK",
    "releaseNotes": "New reporting features and performance improvements",
    "prerequisites": "Java 21, PostgreSQL 14+",
    "packageUrl": "https://storage.azure.com/releases/sistema-principal-1.4.0.tar.gz"
  }
]
```

## Release Management

### 7. Add Client to Release

```bash
curl -X POST "http://release-manager:8080/api/releases/1/clients" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "clientCode": "EMPRESA_A",
    "environment": "PRODUCAO"
  }'
```

### 8. Get Release Details

```bash
curl -X GET "http://release-manager:8080/api/releases/product/Sistema%20Principal/version/1.5.0" \
  -H "Authorization: Bearer $TOKEN"
```

## Client Management

### 9. Create New Client

```bash
curl -X POST "http://release-manager:8080/api/clients" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "clientCode": "NOVA_EMPRESA",
    "companyName": "Nova Empresa Ltda",
    "contactEmail": "contato@novaempresa.com",
    "contactPhone": "+55 11 9999-9999",
    "isBetaPartner": false,
    "notes": "Cliente padrão"
  }'
```

### 10. Get All Active Clients

```bash
curl -X GET "http://release-manager:8080/api/clients?active=true" \
  -H "Authorization: Bearer $TOKEN"
```

## Error Handling

All API endpoints return appropriate HTTP status codes and error messages:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

Error Response Format:
```json
{
  "message": "Error description here"
}
```

## Webhook Integration (Future Enhancement)

For real-time notifications, you can implement webhooks to notify external systems when release status changes:

```bash
# Example webhook payload (design for future implementation)
{
  "event": "release.status.changed",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "releaseId": 1,
    "productName": "Sistema Principal",
    "version": "1.5.0",
    "previousStatus": "EM_TESTE_SISTEMA",
    "newStatus": "APROVADA_TESTE",
    "reason": "All tests passed",
    "changedBy": "qa.analyst",
    "changedAt": "2024-01-15T10:30:00Z"
  }
}
```