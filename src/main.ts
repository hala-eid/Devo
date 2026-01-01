/*import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient,withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { Register } from './app/pages/register/register';
import { authInterceptor } from './app/services/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
  //  { provide: HTTP_INTERCEPTORS, useClass: authInterceptor, multi: true },
    provideHttpClient(
  withInterceptors([authInterceptor])
),
    provideAnimations(),
    importProvidersFrom(
      FormsModule,
      ReactiveFormsModule,
    //  HttpClientModule,
      NgxIntlTelInputModule
    )
  ],
}).catch(err => console.error(err));*/

//Merged 

import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { authInterceptor } from './app/services/auth.interceptor';
//import { CookieService } from 'ngx-cookie-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
   // CookieService, // ✅ PROVIDE SERVICE HERE
    importProvidersFrom(
      FormsModule,
      ReactiveFormsModule,
      NgxIntlTelInputModule,
     // BrowserAnimationsModule,
     CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      })
      
    )
  ],
}).catch(err => console.error(err));

