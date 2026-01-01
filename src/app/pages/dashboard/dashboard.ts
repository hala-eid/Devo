import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgForm, FormsModule } from '@angular/forms'; // Added for the contact form
import { RouterModule } from '@angular/router'; // Added for routerLink
import { MyList } from './my-list/my-list';
import { Tasks } from './tasks/tasks';
import { Notes } from './notes/notes';
import { Calendar } from './calendar/calendar';
import { TeamDashboard } from './team-dashboard/team-dashboard';
import { MiniTimer } from './mini-timer';
import { TinyGame } from './tiny-game';
import { MotivationalQuote } from './motivational-quote';
import { Header } from "./header/header";
import { AuthService } from '../../services/authService';
import { RecentService } from '../../services/RecentService';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    MiniTimer, 
    MotivationalQuote, 
    TinyGame, 
    MyList, 
    Tasks, 
    Notes, 
    Calendar, 
    TeamDashboard, 
    Header
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  // UI State
  selectedTab: string = 'my-list';
  sidebarOpen: boolean = true;
  openSubmenu: string | null = null;
  contactOpen: boolean = false;
  
  // Data State
  recentItems: string[] = [];
  reminderMessage: string = '👀 Don’t forget to check your tasks today';
  submitted: boolean = false;
  backendMessage: string = '';

  // Single Constructor
  constructor(
    private authService: AuthService, 
    private recentService: RecentService
  ) {
    console.log('Dashboard component CREATED');
  }

  ngOnInit(): void {
    // Subscribe to recent items from service
    this.recentService.recentItems$.subscribe((items: string[]) => {
      this.recentItems = items;
    });
    this.authService.sidebarVisible$.subscribe(val => {
      this.sidebarOpen = val;
    });
  }

  // Sidebar & Tabs Logic
  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleSubmenu(menu: string) {
    this.openSubmenu = this.openSubmenu === menu ? null : menu;
  }

  // Contact Modal Logic
  openContact() {
    this.contactOpen = true;
    this.submitted = false; // Reset state when opening
    this.backendMessage = '';
  }

  closeContact() {
    this.contactOpen = false;
  }

  sendContact(formValues: any) {
    // Note: Use formValues from the HTML (form.value)
    console.log('Sending message:', formValues);
    // 1. Simulate a successful send
  this.submitted = true;
  this.backendMessage = 'Your message has been sent successfully! We will get back to you soon.';

  // 2. Optional: Automatically close the modal after 3 seconds
  setTimeout(() => {
    this.closeContact();
    this.submitted = false; // Reset for next time
  }, 3000);
   
  }
}