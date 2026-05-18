import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = inject(AuthService).getAuthToken();
  const loadingService = inject(LoadingService);
  const headersConfig: Record<string, string> = {};

  if (authToken) { 
    headersConfig['Authorization'] = `Bearer ${authToken}`;
  }

  const newReq = req.clone({
    setHeaders: headersConfig,
  });
  
  // Activa el loader global
  loadingService.show();
  
  return next(newReq).pipe(
    finalize(() => loadingService.hide())
  );
};
