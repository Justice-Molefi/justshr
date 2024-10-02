import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { QuillModule } from 'ngx-quill';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { credentialsInterceptorInterceptor } from './interceptors/credentials-interceptor.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(QuillModule.forRoot()), provideHttpClient(withInterceptors([
    credentialsInterceptorInterceptor
  ]))]
};
