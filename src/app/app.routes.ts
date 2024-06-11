import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
// import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: '*',
    component: LoginComponent,
  },
];
