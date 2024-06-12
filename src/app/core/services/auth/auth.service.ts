import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);

  private state = authState(this.auth);

  user: User | null = null;

  constructor() {
    this.state.subscribe((aUser: User | null) => {
      if (aUser) {
        this.user = aUser;
      }
    });
  }

  // Register a new user
  async register(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  // Login existing user
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  // Logout the current user
  async logout() {
    try {
      await signOut(this.auth);
    } catch (error) {}
  }
}
