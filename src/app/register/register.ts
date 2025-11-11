/*import { Component, inject } from '@angular/core';
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
*/
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxIntlTelInputModule, SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule
  ]
})
export class Register {

  registerForm!: FormGroup;
  showPassword = false;
  isLoading = false;

  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.Jordan, CountryISO.UnitedStates];

  defaultAvatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAATUlEQVR4Ae3XMQEAAAwCoNm/9HIoQBoaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMB3AkIWAAGPzktAAAAAElFTkSuQmCC';

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
passwordHash: ['', [
  Validators.required,
  Validators.minLength(8),  // minimum length you want
  Validators.maxLength(20), // maximum length
  Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
]],
      phoneNumber: new FormControl({ number: '', countryCode: CountryISO.Jordan }, Validators.required),
      jobTitle: ['', Validators.required],
      department: ['', Validators.required],
      location: ['', Validators.required],
      role: ['', Validators.required],
      profilePhoto: [null],
       // NEW FIELDS
    reportsTo: ['', Validators.required],      // mandatory
    organization: ['']                         // optional
    });
  }

  toggleShow() {
    this.showPassword = !this.showPassword;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.registerForm.patchValue({ profilePhoto: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  

  onSubmit() {
    console.log('Submit clicked');
    console.log('Form valid?', this.registerForm.valid);
    console.log(this.registerForm.value);

    if (this.registerForm.invalid) return;

    const payload: any = { ...this.registerForm.value };

    // phone number --> string
    payload.phoneNumber = this.registerForm.value.phoneNumber?.e164Number || '';

     // If no profilePhoto is provided, remove it from payload so backend can use default
  if (!payload.profilePhoto) {
    payload.profilePhoto = this.defaultAvatar; // <-- assign your default avatar
  }

    this.isLoading = true;

    this.http.post('http://localhost:5000/api/Auth/register', payload,{responseType: 'text'})
      .subscribe({
        next: (res) => {
          console.log('Registration response', res);
          alert('Registered successfully!');
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Registration error', err);
          alert('Registration failed');
          this.isLoading = false;
        }
      });
  }

  get phoneControl(): FormControl {
    return this.registerForm.get('phoneNumber') as FormControl;
  }
}