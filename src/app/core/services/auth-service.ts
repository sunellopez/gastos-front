import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly isAuthenticatedSignal = signal(this.hasStoredToken());
  public readonly isAuthenticated = computed(() => this.isAuthenticatedSignal());

  constructor() {
    effect(() => {
      console.log('Authentication status changed:', this.isAuthenticated());
    });
  }

  private hasStoredToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        localStorage.setItem('auth_token', res.token);
        this.isAuthenticatedSignal.set(true);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.isAuthenticatedSignal.set(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }
}
