import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  showProfile = false;
  showHelp = false;
  showNotifications = false;
  showSettings = false;

  user = {
    name: 'Hala Eid',
    jobTitle: 'Software Developer',
    department: 'IT',
    reportsTo: 'Maryam Abdulrazaq',
    email: 'hala@example.com',
    phone: '+962-7XXXXXXX',
    organization: 'Diario Corp',
    location: 'Amman, Jordan',
    photo: 'assets/profile-photo.jpg'
  };

  get userInitials() {
    if (!this.user.name) return 'HA';
    const parts = this.user.name.split(' ');
    return parts[0][0] + (parts[1] ? parts[1][0] : '');
  }

  constructor(private router: Router) {}

  toggleProfile() {
    this.showProfile = !this.showProfile;
    this.showHelp = false;
    this.showNotifications = false;
    this.showSettings = false;
  }

  toggleHelp() {
    this.showHelp = !this.showHelp;
    this.showProfile = false;
    this.showNotifications = false;
    this.showSettings = false;
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showProfile = false;
    this.showHelp = false;
    this.showSettings = false;
  }

toggleSettings() {
  this.showSettings = !this.showSettings;
  // Close other dropdowns
  this.showProfile = false;
  this.showHelp = false;
  this.showNotifications = false;
}

  toggleSidebar() {
    console.log('Sidebar toggled');
  }

  setTheme(mode: string) {
    document.body.className = mode === 'dark' ? 'dark-mode' : '';
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
