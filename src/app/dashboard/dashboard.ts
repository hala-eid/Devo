import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Calendar } from '../calendar/calendar';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { TeamDashboard } from '../team-dashboard/team-dashboard';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-dashboard',
  standalone:true,
  imports: [Header,Calendar,CommonModule,RouterOutlet,TeamDashboard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  isSidebarVisible: boolean = true;
 constructor(private router: Router,
    private auth: AuthService
 ) {}

 ngOnInit() {
    // Listen for the toggle from the header
    this.auth.sidebarVisible$.subscribe(visible => {
      this.isSidebarVisible = visible;
    });
  }
goTo(page: string) {
  this.router.navigate([`/dashboard/${page}`]);
}
}
