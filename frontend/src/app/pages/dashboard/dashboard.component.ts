import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigationComponent } from '../../shared/components/navigation/navigation.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavigationComponent
  ],
  template: `<div class="dashboard-container" style="min-height: 100vh; background: #f5f5f5;">
    <!-- Navigation Component -->
    <app-navigation></app-navigation>
    
    <div style="padding: 20px;">
      <!-- Router Outlet for Child Routes -->
      <router-outlet></router-outlet>
    </div>
  </div>`
})
export class DashboardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // Dashboard initialization
  }
}