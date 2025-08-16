import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  // Store the attempted URL for redirecting after login
  sessionStorage.setItem('redirectUrl', state.url);
  
  // Redirect to login
  authService.login();
  return false;
};