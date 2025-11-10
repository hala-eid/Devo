/*import { Injectable ,inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable,tap } from 'rxjs';

export interface User {
  id?: number;
  email: string;
  password: string;
  name?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
// private http = inject(HttpClient);

private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  signIn(PROVIDER_ID: string) {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:5211/api/auth';

  constructor(private http: HttpClient) {
     this.loadStoredUser();
  }
    loadStoredUser() {
        throw new Error('Method not implemented.');
    }

 
  register(user: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, user);
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }
}*/
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
//import { environment } from '../../environments/environment'; // ✅ add this line
import { environment } from '../environments/environment';
export interface User {
  id?: number;
  email: string;
  password: string;
  name?: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  passwordHash: string;
 // confirmPassword?: string;
}


export interface LoginRequest {
  email: string;
  passwordHash: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  googleLogin(arg0: { idToken: string; email: string; name: string; photoUrl: string; }) {
    throw new Error('Method not implemented.');
  }

  private http = inject(HttpClient);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // ✅ dynamically load from environment
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor() {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      const user: User = JSON.parse(userJson);
      this.currentUserSubject.next(user);
    }
  }

  register(userData: RegisterRequest): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData, { headers })
      .pipe(
        tap(response => {
          if (response.success && response.token && response.user) {
            this.setUserAndToken(response);
          }
        }),
        catchError(error => throwError(() => this.handleError(error)))
      );
  }
login(credentials: LoginRequest): Observable<AuthResponse> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials, { headers })
    .pipe(
      tap(response => {
        if (response.success && response.token && response.user) {
          this.setUserAndToken(response);
        }
      }),
      catchError(error => throwError(() => this.handleError(error)))
    );
}



  signIn(provider: string): void {
    console.log(`Signing in with ${provider}`);
    switch (provider) {
      case 'GOOGLE':
        window.location.href = `${this.apiUrl}/google-login`;
        break;
      case 'FACEBOOK':
        window.location.href = `${this.apiUrl}/facebook-login`;
        break;
      case 'APPLE':
        window.location.href = `${this.apiUrl}/apple-login`;
        break;
      default:
        console.warn(`Provider ${provider} not implemented`);
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token') && !!this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/check-email?email=${email}`)
      .pipe(
        map(response => response.exists),
        catchError(error => throwError(() => this.handleError(error)))
      );
  }

  requestPasswordReset(email: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}/forgot-password`, { email }
    ).pipe(
      catchError(error => throwError(() => this.handleError(error)))
    );
  }

  verifyToken(token: string): Observable<{ success: boolean; message: string }> {
    return this.http.get<{ success: boolean; message: string }>(
      `${this.apiUrl}/verify-token?token=${token}`
    ).pipe(
      catchError(error => throwError(() => this.handleError(error)))
    );
  }

  private setUserAndToken(response: AuthResponse): void {
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    if (response.user) {
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      this.currentUserSubject.next(response.user);
    }
  }

  private handleError(error: any): string {
    if (error.error instanceof ErrorEvent) {
      return `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          return error.error?.message || 'Bad request. Please check your input.';
        case 401:
          return 'Invalid email or password. Please try again.';
        case 409:
          return 'Email already exists. Please use a different email.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return error.error?.message || 'An unexpected error occurred.';
      }
    }
  }
}
