import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'inicio',
        loadComponent: () =>
          import('../features/inicio/inicio.page').then((m) => m.InicioPage),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../features/dashboard/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('../features/perfil/perfil.page').then((m) => m.PerfilPage),
      },
      {
        path: '',
        redirectTo: '/tabs/inicio',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/inicio',
    pathMatch: 'full',
  },
];
