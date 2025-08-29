import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { ConfirmationDialogComponent } from './shared/components/confirmation-dialog.component';
import { ConfirmationService } from './shared/services/confirmation.service';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    @if (isLoading()) {
      <div style="height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column;">
        <nz-spin nzSize="large"></nz-spin>
        <p style="margin-top: 16px; color: #666;">Carregando...</p>
      </div>
    } @else if (isAuthenticated()) {
      <nz-layout style="min-height: 100vh;">
        <nz-header style="background: #001529; padding: 0 24px; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center;">
            <h1 style="color: white; margin: 0; font-size: 18px;">Release Manager</h1>
            <ul nz-menu nzTheme="dark" nzMode="horizontal" style="line-height: 64px; background: transparent; margin-left: 40px;">
              <li nz-menu-item routerLink="/dashboard" routerLinkActive="ant-menu-item-selected">
                <span nz-icon nzType="dashboard"></span>
                Dashboard
              </li>
              <li nz-menu-item routerLink="/releases" routerLinkActive="ant-menu-item-selected">
                <span nz-icon nzType="rocket"></span>
                Releases
              </li>
              <li nz-menu-item routerLink="/clients" routerLinkActive="ant-menu-item-selected">
                <span nz-icon nzType="team"></span>
                Clientes
              </li>
            </ul>
          </div>
          
          <div style="display: flex; align-items: center; gap: 12px;">
            <nz-avatar nzIcon="user"></nz-avatar>
            <span style="color: white;">{{ getUserName() }}</span>
            <button nz-button nzType="text" (click)="logout()" style="color: white;">
              <span nz-icon nzType="logout"></span>
              Sair
            </button>
          </div>
        </nz-header>
        
        <nz-content style="padding: 24px; background: #f5f5f5;">
          <router-outlet />
        </nz-content>
      </nz-layout>
      
      <!-- Global confirmation dialog -->
      @if (confirmationService.config()) {
        <app-confirmation-dialog
          [config]="confirmationService.config()!"
          [show]="confirmationService.show()"
          (confirmed)="confirmationService.onConfirmed()"
          (cancelled)="confirmationService.onCancelled()">
        </app-confirmation-dialog>
      }
    } @else {
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <nz-card style="width: 400px; text-align: center;">
          <h1 style="color: #2c3e50; margin-bottom: 10px;">Release Manager</h1>
          <p style="color: #7f8c8d; margin-bottom: 30px;">Sistema de Gerenciamento de Releases</p>
          <button nz-button nzType="primary" nzSize="large" nzBlock (click)="login()">
            <span nz-icon nzType="login"></span>
            Entrar com Azure AD
          </button>
        </nz-card>
      </div>
    }
  `,
  styles: [],
  imports: [
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive, 
    CommonModule, 
    ConfirmationDialogComponent,
    NzLayoutModule,
    NzMenuModule,
    NzButtonModule,
    NzIconModule,
    NzSpinModule,
    NzCardModule,
    NzTypographyModule,
    NzAvatarModule
  ]
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  public confirmationService = inject(ConfirmationService);

  constructor() {
    console.log('AppComponent constructor called');
  }

  ngOnInit() {
    console.log('AppComponent ngOnInit called');
    console.log('Initializing auth service...');
    this.authService.init().catch(err => {
      console.error('Auth service initialization failed:', err);
    });
  }

  isAuthenticated() {
    // const authenticated = this.authService.isAuthenticated();
    // console.log('isAuthenticated():', authenticated);
    // return authenticated;
      return this.authService.isAuthenticated();
  }

  isLoading() {
    // const loading = this.authService.isLoading();
    // console.log('isLoading():', loading);
    // return loading;
      return this.authService.isLoading();
  }

  getUserName() {
    return this.authService.getUserName();
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}
      