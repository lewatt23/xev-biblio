import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {
  redirectUnauthorizedTo,
  canActivate,
  AuthPipe,
  emailVerified,
  isNotAnonymous,
  AuthPipeGenerator,
  hasCustomClaim,
} from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin: AuthPipeGenerator = () =>
  redirectUnauthorizedTo(['/login']);

const adminOnly = () => hasCustomClaim('admin');
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,

    ...canActivate(redirectUnauthorizedToLogin),
  },
  { path: '**', redirectTo: 'login' },
];
