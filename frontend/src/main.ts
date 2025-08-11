import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import Keycloak from 'keycloak-js';
import { AppComponent } from './app/app.component';

async function init() {
  const keycloak = new Keycloak({
    url: 'http://localhost:8080',
    realm: 'master',
    clientId: 'release-manager'
  });
  await keycloak.init({ onLoad: 'login-required' });
  await bootstrapApplication(AppComponent, {
    providers: [provideHttpClient(), { provide: Keycloak, useValue: keycloak }]
  });
}

init();
