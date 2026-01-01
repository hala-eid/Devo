import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { Login } from './pages/login/login';
import { Calendar } from './pages/dashboard/calendar/calendar';
import { Notes } from './pages/dashboard/notes/notes';
import { TeamDashboard } from './pages/dashboard/team-dashboard/team-dashboard';
import { Tasks } from './pages/dashboard/tasks/tasks';
import { MyList } from './pages/dashboard/my-list/my-list';
import { Welcome } from './pages/welcome/welcome';

export const routes: Routes = [
{ path: '', component: Welcome },
  // 2. Authentication Routes
  { path: 'login', component: Login }, 
  { path: 'register', component: Register },
  {
    path: 'dashboard',
    component: Dashboard,
    children: [
    { path: '', redirectTo: 'calendar', pathMatch: 'full' },  
    { path: 'my-list', component: MyList },
    { path: 'calendar', component: Calendar },
    { path: 'calendar/:id', component: Calendar },
    { path: 'notes', component: Notes },
    { path: 'notes/:id', component: Notes },
    { path: 'team-dashboard', component: TeamDashboard },
     { path: 'tasks', component: Tasks },
      // { path: 'meetings', component: Meetings },
      // { path: 'profile', component: Profile }
    ]
  },

  // 4. Fallback: Redirect any unknown paths to login or dashboard
  { path: '**', redirectTo: 'login' }


];