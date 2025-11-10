import { Dashboard } from './dashboard/dashboard';
import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'register', component: Register},
    { path: 'dashboard', component: Dashboard},
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];