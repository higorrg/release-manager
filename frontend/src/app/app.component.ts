import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzButtonModule,
    NzAvatarModule,
    NzDropDownModule
  ],
  template: `
    <nz-layout class="app-layout">
      <nz-sider class="menu-sidebar" nzCollapsible nzWidth="256px" nzBreakpoint="md">
        <div class="sidebar-logo">
          <h2>Release Manager</h2>
        </div>
        <ul nz-menu nzMode="inline" nzTheme="dark" [nzInlineCollapsed]="isCollapsed">
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/dashboard">
              <span nz-icon nzType="dashboard"></span>
              <span>Dashboard</span>
            </a>
          </li>
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/releases">
              <span nz-icon nzType="deployment-unit"></span>
              <span>Releases</span>
            </a>
          </li>
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/clients">
              <span nz-icon nzType="team"></span>
              <span>Clientes</span>
            </a>
          </li>
        </ul>
      </nz-sider>
      <nz-layout>
        <nz-header class="app-header">
          <div class="header-content">
            <button nz-button nzType="text" (click)="isCollapsed = !isCollapsed">
              <span nz-icon [nzType]="isCollapsed ? 'menu-unfold' : 'menu-fold'"></span>
            </button>
            
            <div class="user-menu">
              <nz-avatar nzIcon="user"></nz-avatar>
              <a nz-dropdown [nzDropdownMenu]="userMenu">
                <span nz-icon nzType="down"></span>
              </a>
              <nz-dropdown-menu #userMenu="nzDropdownMenu">
                <ul nz-menu>
                  <li nz-menu-item (click)="logout()">
                    <span nz-icon nzType="logout"></span>
                    Sair
                  </li>
                </ul>
              </nz-dropdown-menu>
            </div>
          </div>
        </nz-header>
        <nz-content class="inner-content">
          <router-outlet></router-outlet>
        </nz-content>
      </nz-layout>
    </nz-layout>
  `,
  styles: [`
    .app-layout {
      min-height: 100vh;
    }

    .menu-sidebar {
      position: fixed;
      height: 100vh;
      left: 0;
      overflow-y: auto;
    }

    .sidebar-logo {
      height: 64px;
      margin: 16px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;

      h2 {
        color: white;
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }
    }

    nz-header.app-header {
      background: #fff;
      padding: 0;
      box-shadow: 0 1px 4px rgba(0,21,41,.08);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .inner-content {
      margin: 24px 16px 0;
      overflow: initial;
    }

    nz-layout {
      margin-left: 256px;
    }

    @media (max-width: 767px) {
      nz-layout {
        margin-left: 0;
      }
      
      .menu-sidebar {
        position: relative;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  
  isCollapsed = false;

  ngOnInit(): void {
    // Initialize authentication if needed
  }

  logout(): void {
    // Implement logout logic with Keycloak
    console.log('Logout clicked');
  }
}