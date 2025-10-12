import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth-guard';

export const routes: Routes = [
  {
    path: '',
    canActivateChild:  [authGuard],
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'signup',
    loadComponent: () => import('./features/auth/signup/signup.page').then( m => m.SignupPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.page').then( m => m.LoginPage)
  }
];
