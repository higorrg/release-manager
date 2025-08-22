import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('@features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'releases',
    loadChildren: () => import('@features/releases/releases.routes').then(m => m.releasesRoutes),
    canActivate: [authGuard]
  },
  {
    path: 'clients',
    loadChildren: () => import('@features/clients/clients.routes').then(m => m.clientsRoutes),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('@core/components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];