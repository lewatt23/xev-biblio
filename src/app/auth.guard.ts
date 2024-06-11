import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
// import { AuthService } from './auth.service';

export const AuthGuard: CanActivateFn = async (route, state) => {
  //   const angularFireAuth = inject(AuthService);
  //   const user = await angularFireAuth.angularFireAuth.user;
  // coerce to boolean
  //   const isLoggedIn = !!user;
  return true;
};
