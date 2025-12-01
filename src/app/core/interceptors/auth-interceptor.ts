import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = inject(AuthService).getAuthToken();
  const headersConfig: Record<string, string> = {};

  if (authToken) { 
    headersConfig['Authorization'] = `Bearer ${authToken}`;
  }

  const newReq = req.clone({
    setHeaders: headersConfig,
  });
  
  return next(newReq);
};
