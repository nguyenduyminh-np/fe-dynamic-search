import { provideEventPlugins } from '@taiga-ui/event-plugins';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/auth/auth-interceptors';
import { globalErrorInterceptor } from './core/interceptors/global-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideEventPlugins(),
    // globalErrorInterceptor chạy SAU authInterceptor để không can thiệp vào logic refresh token
    provideHttpClient(
      withInterceptors([authInterceptor, globalErrorInterceptor]),
    ),
  ],
};
