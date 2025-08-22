import { Routes } from '@angular/router';

export const releasesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/release-list/release-list.component').then(m => m.ReleaseListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/release-detail/release-detail.component').then(m => m.ReleaseDetailComponent)
  }
];