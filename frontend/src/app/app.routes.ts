import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/releases',
    pathMatch: 'full'
  },
  {
    path: 'releases',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/releases/release-list.component').then(m => m.ReleaseListComponent)
  },
  {
    path: 'releases/:id',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/releases/release-detail.component').then(m => m.ReleaseDetailComponent)
  },
  {
    path: 'releases/:id/history',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/releases/release-history.component').then(m => m.ReleaseHistoryComponent)
  },
  {
    path: 'clients',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/clients/client-list.component').then(m => m.ClientListComponent)
  },
  {
    path: '**',
    redirectTo: '/releases'
  }
];