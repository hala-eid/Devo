import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { CookieService } from 'ngx-cookie-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideAnimations(),
    importProvidersFrom(
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule,
      CookieService,
      
      BrowserAnimationsModule
    )
  ]
}).catch(err => console.error(err));
