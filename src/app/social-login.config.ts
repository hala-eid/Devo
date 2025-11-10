// src/app/social-login.provider.ts
/*import { Provider } from '@angular/core';
import { SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';

export function provideSocialLogin(): Provider {
  return {
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(
            '774955427995-n4auvoc0htkggc5shurvtovu3599kauc.apps.googleusercontent.com' // <- paste client id from Google
          )
        }
      ],
      onError: (err: any) => console.error('Social login error', err)
    } as SocialAuthServiceConfig
  };
}
*/