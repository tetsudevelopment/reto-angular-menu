import { Routes } from '@angular/router';
import { loginRedirectGuard } from './login-redirect.guard';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [loginRedirectGuard],
    loadComponent: () => import('./pages/login/login.component'),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/menu/menu.component'),
  },
  {
    path: 'search',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/search/search.component'),
  },
  {
    path: 'detail/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/detail/detail.component'),
  },
  {
    path: '**',
    redirectTo: '/',
  }
];
