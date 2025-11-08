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
