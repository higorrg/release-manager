import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ReleaseListComponent } from './pages/releases/release-list/release-list.component';
import { ReleaseDetailComponent } from './pages/releases/release-detail/release-detail.component';
import { ReleaseHistoryComponent } from './pages/releases/release-history/release-history.component';
import { ReleaseClientsComponent } from './pages/releases/release-clients/release-clients.component';
import { ClientListComponent } from './pages/clients/client-list/client-list.component';
import { ApiDocComponent } from './pages/api/api-doc/api-doc.component';
import { PipelineIntegrationComponent } from './pages/pipeline/pipeline-integration/pipeline-integration.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'releases', pathMatch: 'full' },
      { path: 'releases', component: ReleaseListComponent },
      { path: 'releases/:id', component: ReleaseDetailComponent },
      { path: 'releases/:id/history', component: ReleaseHistoryComponent },
      { path: 'releases/:id/clients', component: ReleaseClientsComponent },
      { path: 'clients', component: ClientListComponent },
      { path: 'pipeline', component: PipelineIntegrationComponent },
      { path: 'api', component: ApiDocComponent }
    ]
  },
  { path: '**', redirectTo: '/login' }
];