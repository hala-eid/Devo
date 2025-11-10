/*import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
//import { authInterceptor } from './app/interceptors/auth.interceptor';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { routes } from './app/app.routes';
//import { provideSocialLogin } from './app/social-login.config'; // your provider
import { HttpClientModule } from '@angular/common/http';
import { SocialLoginModule } from '@abacritt/angularx-social-login'; 
bootstrapApplication(App, {
  providers: [
    // Routing
    provideRouter(routes),
    // HTTP Client with interceptor
   // provideHttpClient(withInterceptors([authInterceptor])),
    // Animations
    //provideAnimations(),
    // Import FormsModule if using forms in your components
    importProvidersFrom(HttpClientModule, SocialLoginModule),
    // Social Login Provider
    //provideSocialLogin()
  ]
}).catch(err => console.error(err));
*/

import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule, SocialLoginModule, FormsModule, ReactiveFormsModule),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideAnimations()
  ]
}).catch(err => console.error(err));
