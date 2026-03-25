import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top', // ✅ ALWAYS go to top on navigation
        anchorScrolling: 'enabled' // ✅ allows fragment scrolling (services, about, etc.)
      })
    ),
    provideHttpClient()
  ]
};