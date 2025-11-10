import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login} from './login/login';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Dashboard } from './dashboard/dashboard';
import { Header } from './header/header';
@Component({
  selector: 'app-root',
   standalone: true,
  imports: [RouterOutlet,HttpClientModule,CommonModule,FormsModule,Login,Dashboard,Header],
  templateUrl: './app.html',
styleUrls: ['./app.css']
})
export class App {
 // protected readonly title = signal('employee-tracking-app');
}
