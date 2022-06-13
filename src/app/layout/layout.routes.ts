import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/data-access/auth.guard';
import { NonAuthGuard } from '../shared/data-access/non-auth.guard';

export const layoutRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('../home/home.component').then((m) => m.HomeComponent)
  },
  {
    path: 'login',
    canActivate: [NonAuthGuard],
    canLoad: [NonAuthGuard],
    loadComponent: () => import('../auth/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'register',
    canActivate: [NonAuthGuard],
    canLoad: [NonAuthGuard],
    loadComponent: () =>
      import('../auth/register/register.component').then((m) => m.RegisterComponent)
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    loadComponent: () => import('../settings/settings.component').then((m) => m.SettingsComponent)
  },
  {
    path: 'editor',
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    loadChildren: () => import('../editor/editor.routes').then((m) => m.editorRoutes)
  },
  {
    path: 'profile/:username',
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    loadComponent: () => import('../profile/profile.component').then((m) => m.ProfileComponent)
  },
  {
    path: 'article/:slug',
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    loadComponent: () => import('../article/article.component').then((m) => m.ArticleComponent)
  }
];
