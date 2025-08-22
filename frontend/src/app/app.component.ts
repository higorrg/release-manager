import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '@core/services/auth.service';
import { NavigationComponent } from '@core/components/navigation/navigation.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatProgressSpinnerModule,
    NavigationComponent
  ],
  template: `
    @if (authService.isInitialized()) {
      @if (authService.isAuthenticated()) {
        <app-navigation>
          <router-outlet></router-outlet>
        </app-navigation>
      } @else {
        <div class="login-container">
          <router-outlet></router-outlet>
        </div>
      }
    } @else {
      <div class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Inicializando aplicação...</p>
      </div>
    }
  `,
  styles: [`
    .login-container {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .loading-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);

  ngOnInit() {
    this.authService.init();
  }
}