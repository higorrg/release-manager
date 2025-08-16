import { Routes } from '@angular/router';
import { authGuard } from './features/releases/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/releases',
    pathMatch: 'full'
  },
  {
    path: 'releases',
    canActivate: [authGuard],
    loadComponent: () => import('./features/releases/release-list.component').then(m => m.ReleaseListComponent)
  },
  {
    path: 'releases/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/releases/release-detail.component').then(m => m.ReleaseDetailComponent)
  },
  {
    path: 'releases/:id/history',
    canActivate: [authGuard],
    loadComponent: () => import('./features/releases/release-history.component').then(m => m.ReleaseHistoryComponent)
  },
  {
    path: 'clients',
    canActivate: [authGuard],
    loadComponent: () => import('./features/releases/client-list.component').then(m => m.ClientListComponent)
  },
  {
    path: '**',
    redirectTo: '/releases'
  }
];