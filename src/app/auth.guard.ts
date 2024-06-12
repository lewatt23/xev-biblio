import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, User, authState } from '@angular/fire/auth';

export const authGuard = () => {
  const afAuth = inject(Auth);
  const state = authState(afAuth);
  const router = inject(Router);

  state.subscribe((aUser: User | null) => {
    if (!aUser) {
      router.navigate(['/login']);
    } else {
      router.navigate(['/dashboard']);
    }
  });
};
