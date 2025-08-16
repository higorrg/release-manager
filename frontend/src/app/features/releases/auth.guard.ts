import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  console.log('Auth guard called for:', state.url);
  console.log('Is authenticated:', authService.isAuthenticated());
  console.log('Is loading:', authService.isLoading());
  
  // If still loading, don't allow navigation
  if (authService.isLoading()) {
    console.log('Auth still loading, blocking navigation');
    return false;
  }
  
  if (authService.isAuthenticated()) {
    console.log('User is authenticated, allowing access');
    return true;
  }
  
  console.log('User not authenticated, initiating login');
  // Store the attempted URL for redirecting after login
  sessionStorage.setItem('redirectUrl', state.url);
  
  // Redirect to login
  authService.login();
  return false;
};