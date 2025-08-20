import { Routes } from '@angular/router';
import { ReleaseDashboardComponent } from './features/release/components/release-dashboard/release-dashboard.component';

export const routes: Routes = [
    {
        path: 'dashboard',
        component: ReleaseDashboardComponent
    },
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    // Add a wildcard route for 404 handling later
    // { path: '**', component: PageNotFoundComponent },
];
