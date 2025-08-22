import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';

import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-navigation',
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #drawer class="sidenav" fixedInViewport="true">
        <mat-toolbar>Menu</mat-toolbar>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
            <mat-icon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/releases" routerLinkActive="active">
            <mat-icon>new_releases</mat-icon>
            <span>Releases</span>
          </a>
          <a mat-list-item routerLink="/clients" routerLinkActive="active">
            <mat-icon>people</mat-icon>
            <span>Clientes</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button
            type="button"
            aria-label="Toggle sidenav"
            mat-icon-button
            (click)="drawer.toggle()">
            <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
          </button>
          
          <span>Release Manager</span>
          
          <div class="spacer"></div>
          
          <button mat-button [matMenuTriggerFor]="userMenu">
            <mat-icon>person</mat-icon>
            <span>{{ authService.user()?.firstName || 'Usuário' }}</span>
            <mat-icon>arrow_drop_down</mat-icon>
          </button>
          
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item (click)="logout()">
              <mat-icon>exit_to_app</mat-icon>
              <span>Sair</span>
            </button>
          </mat-menu>
        </mat-toolbar>
        
        <div class="content">
          <ng-content></ng-content>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100%;
    }

    .sidenav {
      width: 200px;
    }

    .sidenav .mat-toolbar {
      background: inherit;
    }

    .mat-toolbar.mat-primary {
      position: sticky;
      top: 0;
      z-index: 1;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .content {
      padding: 16px;
    }

    .mat-list-item.active {
      background-color: rgba(0, 0, 0, 0.08);
    }

    .mat-list-item mat-icon {
      margin-right: 16px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent {
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}