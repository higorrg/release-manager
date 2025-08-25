import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const message = inject(NzMessageService);

  // Check if user is authenticated
  if (!authService.isAuthenticated() || !authService.getToken()) {
    message.warning('Você precisa fazer login para acessar esta página.');
    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Check if token is expired
  if (authService.isTokenExpired()) {
    authService.logout();
    message.warning('Sua sessão expirou. Faça login novamente.');
    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  return true;
};

// Guard for role-based access
export const RoleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const message = inject(NzMessageService);

    // First check if authenticated
    if (!AuthGuard(route, state)) {
      return false;
    }

    // Check if user has required role
    if (!authService.hasAnyRole(allowedRoles)) {
      message.error('Você não tem permissão para acessar esta página.');
      router.navigate(['/dashboard']);
      return false;
    }

    return true;
  };
};

// Guard for admin access only
export const AdminGuard: CanActivateFn = RoleGuard(['ADMIN']);

// Guard for manager and admin access
export const ManagerGuard: CanActivateFn = RoleGuard(['ADMIN', 'MANAGER']);

// Guard for preventing access to auth pages when already logged in
export const NoAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && !authService.isTokenExpired()) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};