import { Component,signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css'
})
export class Welcome {
constructor(private router: Router) {}

goToLogin() {
  this.router.navigate(['/login']);
}
goToSignup() {
    this.router.navigate(['/register']); // Assuming your route is /register
  }
}
