import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'releases',
    loadComponent: () => import('./features/releases/releases.component').then(m => m.ReleasesComponent)
  },
  {
    path: 'clients',
    loadComponent: () => import('./features/clients/clients.component').then(m => m.ClientsComponent)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];