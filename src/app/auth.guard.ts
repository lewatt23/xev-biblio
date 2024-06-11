import { AngularFireAuth } from '@angular/fire/compat/auth';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';

export const authGuard = () => {
  const afAuth = inject(AngularFireAuth);
  const router = inject(Router);
  return afAuth.authState.pipe(
    map((user) => !!user), // Convert user presence to a boolean (true if user exists)
    tap((loggedIn) => {
      if (!loggedIn) {
        router.navigate(['/login']); // Redirect to login if not logged in
      }
    })
  );
};
