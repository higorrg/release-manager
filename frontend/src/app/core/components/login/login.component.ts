import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Release Manager</mat-card-title>
          <mat-card-subtitle>Sistema de Gerenciamento de Releases</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="login-content">
            <mat-icon class="login-icon">security</mat-icon>
            <p>Faça login com suas credenciais corporativas</p>
          </div>
        </mat-card-content>
        
        <mat-card-actions>
          <button 
            mat-raised-button 
            color="primary" 
            class="login-button"
            (click)="login()">
            <mat-icon>login</mat-icon>
            Entrar com Azure AD
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .login-card {
      width: 400px;
      max-width: 90vw;
      text-align: center;
    }

    .login-content {
      padding: 32px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .login-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
      color: #1976d2;
    }

    .login-button {
      width: 100%;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private authService = inject(AuthService);

  login() {
    this.authService.login();
  }
}