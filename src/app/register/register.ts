import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RegisterRequest } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  private router = inject(Router);
  private authService = inject(AuthService);

  fullName = '';
  email = '';
  passwordHash = '';
  confirmPassword = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  onSubmit(): void {
    if (this.isFormValid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const registerData: RegisterRequest = {
        fullName: this.fullName,
        email: this.email,
        passwordHash: this.passwordHash
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response && response.message) {
            this.successMessage = response.message || 'Registration successful! Redirecting...';
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          } else {
            this.errorMessage = 'Registration failed. Please try again.';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
          console.error('Registration error:', error);
        }
      });
    } else {
      this.errorMessage = 'Please fill all fields correctly.';
    }
  }

  get isFormValid(): boolean {
    return (
      this.fullName.trim().length > 0 &&
      this.email.includes('@') &&
      this.passwordHash.length >= 6 &&
      this.passwordHash === this.confirmPassword
    );
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  onInputChange(): void {
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }
}
