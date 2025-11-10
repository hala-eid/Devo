import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';

import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(SocialLoginModule, HttpClientModule),

    // ✅ Google Login Provider
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '774955427995-n4auvoc0htkggc5shurvtovu3599kauc.apps.googleusercontent.com' // ⬅️ replace with your actual client ID
            ),
          },
        ],
        onError: (err: any) => {
          console.error('Social Login Error:', err);
        },
      } as SocialAuthServiceConfig,
    },
  ],
};
