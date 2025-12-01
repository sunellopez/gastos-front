import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authTokenKey = 'auth_token';
  private readonly userKey = 'user';

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  private authToken = signal<string | null>(this.getAuthTokenFromStorage());
  private user = signal<any | null>(this.getUserFromStorage());

  readonly isAuthenticated = computed(() => !!this.authToken());

  constructor() {}

  // === TOKEN ===
  getAuthToken(): string {
    return this.authToken() ?? '';
  }

  setAuthToken(token: string): void {
    localStorage.setItem(this.authTokenKey, token);
    this.authToken.set(token);
  }

  private getAuthTokenFromStorage(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  getUserSignal() {
    return this.user;
  }

  private getUserFromStorage(): any | null {
    const saved = localStorage.getItem(this.userKey);
    return saved ? JSON.parse(saved) : null;
  }

  async setSession(user: any) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.user.set(user);
  }

  clearSession() {
    localStorage.removeItem(this.authTokenKey);
    localStorage.removeItem(this.userKey);
    this.authToken.set(null);
    this.user.set(null);
  }

  // === API ===
  login(userData: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, userData);
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  signUp(userData: any) {
    return this.http.post(`${this.apiUrl}/sign-up`, userData);
  }
}