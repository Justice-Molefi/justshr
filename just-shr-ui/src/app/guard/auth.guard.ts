import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const userService: UserService = inject(UserService);
  const router: Router = inject(Router);

  return userService.verifyToken().pipe(
    map( res =>{ console.log("The PROPHECY IS TRUE"); return true}),
    catchError(err => { 
      router.navigate(['/login'])
      return of(false);
    })
  )
  
};
