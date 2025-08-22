export const environment = {
  production: true,
  apiUrl: '/api',
  keycloak: {
    url: process.env['KEYCLOAK_URL'] || 'http://localhost:8080',
    realm: 'release-manager',
    clientId: 'release-manager-frontend'
  }
};