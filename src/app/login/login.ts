import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService, UserProfile } from '../auth.service';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

 export interface LoginRequest {
  email: string;
  passwordHash: string;
}
export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: any;
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink,ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})

export class Login implements OnInit, OnDestroy {
  // --- Dependency Injection ---
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
 
  // --- State Variables ---
  title = 'Login Page';
  email = '';
  password = '';
  userId!: string;
  isLoading = false;
  errorMessage = '';
  isGoogleLoading = false;
  loggedIn = false;
  showPassword = false;
   rememberMe = false;
   

  private authStateSubscription!: Subscription;

  // --- Lifecycle Hooks ---
  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    console.log('User ID from URL:', this.userId);

    
  }

  ngOnDestroy() {
    if (this.authStateSubscription) {
      this.authStateSubscription.unsubscribe();
    }
  }

  // --- Validation Methods ---
  validateEmail(email: string): string | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Invalid email format.';
    return null;
  }
/*
  validatePassword(password: string): string | null {
    if (password.length < 7) return 'Password must be at least 7 characters long.';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain at least one symbol.';
    const numbers = password.match(/\d/g);
    if (!numbers || numbers.length < 3) return 'Password must contain at least 3 numbers.';
    return null;
  }*/

  // --- Main Form Submit ---
  onSubmit(): void {
    if (this.email && this.password) {
      this.isLoading = true;
      this.errorMessage = '';

      // Run validation
      const emailError = this.validateEmail(this.email);
      if (emailError) {
        this.errorMessage = emailError;
        this.isLoading = false;
        return;
      }

      /*const passwordError = this.validatePassword(this.password);
      if (passwordError) {
        this.errorMessage = passwordError;
        this.isLoading = false;
        return;
      }*/

      // If valid, login with backend
      this.loginWithBackend();
    } else {
      this.errorMessage = 'Please enter both email and password.';
    }
  }

// --- Backend Login ---
private loginWithBackend(): void {
  const credentials = {
    email: this.email,
    passwordHash: this.password  
  };



  this.authService.login(credentials).subscribe({
    next: (response) => {
      this.isLoading = false;


      if (response.success && response.token) {
        localStorage.setItem('token', response.token);
        
        // Success Popup
        this.snackBar.open('Welcome back!', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
        
        this.router.navigate(['/dashboard']); 

      }
    },
    error: (error) => {
      this.isLoading = false;
      // Determine the message
      this.errorMessage = error?.status === 401 
        ? 'Invalid email or password.' 
        : 'Login failed. Please try again.';

      // Error Popup
      this.snackBar.open(this.errorMessage, 'Close', {
        duration: 5000,
        verticalPosition: 'top', 
        panelClass: ['error-snackbar'] 
      });
    }
  });
}

  // --- Navigation ---
  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  // Optional: Keep the existing submit alias
  submit() {
    this.onSubmit();
  }

  toggleShow() {
  this.showPassword = !this.showPassword;
}

login() {
  const credentials = {
    email: this.email,
    passwordHash: this.password
  };

  this.authService.login(credentials).subscribe({
    next: (response) => {
      if (response.success) {
        this.router.navigate(['/dashboard']);
      }
    },
    error: (err) => {
      this.errorMessage = err;
    }
  });
}

}