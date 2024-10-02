import { HttpInterceptorFn } from '@angular/common/http';

export const credentialsInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  
  const clonedRequest = req.clone({withCredentials: true});
  return next(clonedRequest);
};
