import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Erro desconhecido';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Erro: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 401:
            errorMessage = 'Não autorizado';
            break;
          case 403:
            errorMessage = 'Acesso negado';
            break;
          case 404:
            errorMessage = 'Recurso não encontrado';
            break;
          case 500:
            errorMessage = 'Erro interno do servidor';
            break;
          default:
            errorMessage = error.error?.message || `Erro ${error.status}: ${error.statusText}`;
        }
      }

      snackBar.open(errorMessage, 'Fechar', {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });

      return throwError(() => error);
    })
  );
};