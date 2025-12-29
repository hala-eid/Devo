import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { Dashboard } from './dashboard/dashboard';
import { Calendar } from './calendar/calendar';
import { Notes } from './notes/notes';
import { TeamDashboard } from './team-dashboard/team-dashboard';
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  {
    path: 'dashboard',
    component: Dashboard,
    children: [
    { path: '', redirectTo: 'calendar', pathMatch: 'full' },  // default
    { path: 'calendar', component: Calendar },
    { path: 'calendar/:id', component: Calendar },
    { path: 'notes', component: Notes },
    { path: 'notes/:id', component: Notes },
 { path: 'team-dashboard', component: TeamDashboard }
      // { path: 'tasks', component: Tasks },
      // { path: 'meetings', component: Meetings },
      // { path: 'profile', component: Profile }
    ]
  },

  { path: '**', redirectTo: '/login' }
];
