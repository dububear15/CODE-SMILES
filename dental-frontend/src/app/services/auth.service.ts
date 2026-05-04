import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { Observable, tap } from 'rxjs';

export type UserRole = 'Patient' | 'Staff' | 'Admin';

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  token: string;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private api: ApiService, private router: Router) {}

  login(email: string, password: string, role: UserRole): Observable<any> {
    return this.api.login(email, password, role).pipe(
      tap((res: AuthUser) => {
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res));
        // Fetch and cache avatar after login
        this.api.getUserProfile(res.id).subscribe({
          next: (profile) => {
            if (profile.avatar_url) {
              localStorage.setItem('user_avatar', profile.avatar_url);
            } else {
              localStorage.removeItem('user_avatar');
            }
          },
          error: () => {}
        });
      })
    );
  }

  register(data: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
  }): Observable<any> {
    return this.api.register(data);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('user_avatar');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): UserRole | null {
    return this.getUser()?.role ?? null;
  }

  /** Returns the correct dashboard route for the logged-in role */
  getDashboardRoute(): string {
    const role = this.getRole();
    if (role === 'Patient') return '/patient-dashboard';
    if (role === 'Staff') return '/staff-dashboard';
    if (role === 'Admin') return '/dentist-dashboard';
    return '/login';
  }
}
