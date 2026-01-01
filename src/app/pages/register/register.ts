import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxIntlTelInputModule, SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import {  RouterModule,Router } from '@angular/router';
import { AuthService } from '../../services/authService';
@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
    RouterModule
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

constructor(
  private fb: FormBuilder,
  private http: HttpClient,
  private router: Router ,
   private authService: AuthService,
) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      passwordHash: ['', [
  Validators.required,
  Validators.minLength(8),
  Validators.maxLength(20),
  Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
]]
,
      phoneNumber: new FormControl({ number: '', countryCode: CountryISO.Jordan }, Validators.required),
      jobTitle: ['', Validators.required],
      departmentId: ['', Validators.required],
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
  if (this.registerForm.invalid) return;

  const formValue = this.registerForm.value;

  // Manually construct the payload to match EXACTLY what the C# User model expects
  const payload: any = {
    fullName: formValue.fullName,
    email: formValue.email,
    passwordHash: formValue.passwordHash,
    phoneNumber: formValue.phoneNumber?.e164Number || '',
    jobTitle: formValue.jobTitle,
    departmentId: formValue.departmentId, // Matches C# property
    location: formValue.location,
    role: formValue.role,
    reportsTo: formValue.reportsTo,       // Matches C# property
    organization: formValue.organization,
    // Note: Service interface uses profilePhotoUrl, C# uses ProfilePhoto
    profilePhoto: formValue.profilePhoto || this.defaultAvatar 
  };

  this.isLoading = true;

  this.authService.register(payload).subscribe({
    next: (res) => {
      // res.success must be true for this to trigger properly
      alert('Registered successfully!');
      this.isLoading = false;
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      console.error('Registration error', err);
     alert(err.error?.message || 'Registration failed');
 // This will show the friendly error from your service's handleError
      this.isLoading = false;
    }
  });
}

}