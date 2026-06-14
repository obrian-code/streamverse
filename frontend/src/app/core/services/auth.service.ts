import { Injectable, Inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map, catchError, throwError } from 'rxjs';
import { ApiService, ApiResponse } from './api.service';
import { APP_CONFIG, AppConfig } from '../../app.config';

export interface User {
  id: string;
  email: string;
  username: string;
  avatar: string;
  role: 'user' | 'admin';
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  language: string;
  autoplay: boolean;
  subtitles: boolean;
  subtitleLanguage: string;
  quality: string;
  matureContent: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

@Injectable()
export class AuthService {
  private readonly userSubject = new BehaviorSubject<User | null>(null);
  private readonly tokensSubject = new BehaviorSubject<AuthTokens | null>(null);
  private refreshTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly user$ = this.userSubject.asObservable();
  readonly tokens$ = this.tokensSubject.asObservable();
  readonly isAuthenticated$ = this.userSubject.pipe(map(user => !!user));

  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor(
    private api: ApiService,
    private http: HttpClient,
    @Inject(APP_CONFIG) private config: AppConfig,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const tokensStr = localStorage.getItem(`${this.config.storagePrefix}${this.config.tokenKey}`);
      const userStr = localStorage.getItem(`${this.config.storagePrefix}user`);

      if (tokensStr) {
        const tokens = JSON.parse(tokensStr) as AuthTokens;
        this.tokensSubject.next(tokens);
      }

      if (userStr) {
        const user = JSON.parse(userStr) as User;
        this.userSubject.next(user);
        this.currentUser.set(user);
      }
    } catch {
      this.clearAuth();
    }
  }

  login(credentials: LoginRequest): Observable<User> {
    return this.api.post<User>('auth/login', credentials).pipe(
      tap(response => {
        this.handleAuthResponse(response.data, response);
      }),
      map(response => response.data as unknown as User)
    );
  }

  register(data: RegisterRequest): Observable<User> {
    return this.api.post<User>('auth/register', data).pipe(
      tap(response => {
        if ((response as any).tokens) {
          this.handleAuthResponse(response.data, response);
        }
      }),
      map(response => response.data as unknown as User)
    );
  }

  private isLoggingOut = false;

  logout(): void {
    if (this.isLoggingOut) return;
    this.isLoggingOut = true;

    if (this.tokensSubject.value?.accessToken) {
      this.api.post('auth/logout', {}).subscribe({
        error: () => {},
        complete: () => { this.isLoggingOut = false; }
      });
    }

    this.clearAuth();
  }

  refreshToken(): Observable<AuthTokens> {
    const tokens = this.tokensSubject.value;
    if (!tokens?.refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<ApiResponse<AuthTokens>>(
      `${this.config.apiUrl}/auth/refresh`,
      { refreshToken: tokens.refreshToken }
    ).pipe(
      tap(response => {
        this.storeTokens(response.data);
      }),
      map(response => response.data),
      catchError(error => {
        this.clearAuth();
        return throwError(() => error);
      })
    );
  }

  getProfile(): Observable<User> {
    return this.api.get<User>('auth/profile').pipe(
      tap(response => {
        this.userSubject.next(response.data);
        this.currentUser.set(response.data);
        this.storeUser(response.data);
      }),
      map(response => response.data)
    );
  }

  updateProfile(data: Partial<User>): Observable<User> {
    return this.api.patch<User>('auth/profile', data).pipe(
      tap(response => {
        this.userSubject.next(response.data);
        this.currentUser.set(response.data);
        this.storeUser(response.data);
      }),
      map(response => response.data)
    );
  }

  updatePreferences(preferences: Partial<UserPreferences>): Observable<User> {
    return this.api.patch<User>('auth/preferences', preferences).pipe(
      tap(response => {
        this.userSubject.next(response.data);
        this.currentUser.set(response.data);
        this.storeUser(response.data);
      }),
      map(response => response.data)
    );
  }

  getAccessToken(): string | null {
    return this.tokensSubject.value?.accessToken ?? null;
  }

  getRefreshToken(): string | null {
    return this.tokensSubject.value?.refreshToken ?? null;
  }

  private handleAuthResponse(user: User, response: any): void {
    const tokens: AuthTokens = {
      accessToken: response.tokens?.accessToken || (response as any).accessToken,
      refreshToken: response.tokens?.refreshToken || (response as any).refreshToken,
      expiresIn: response.tokens?.expiresIn || (response as any).expiresIn || 3600
    };

    this.userSubject.next(user);
    this.currentUser.set(user);
    this.storeTokens(tokens);
    this.storeUser(user);
    this.scheduleTokenRefresh(tokens.expiresIn);
  }

  private storeTokens(tokens: AuthTokens): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.tokensSubject.next(tokens);
    localStorage.setItem(`${this.config.storagePrefix}${this.config.tokenKey}`, JSON.stringify(tokens));
  }

  private storeUser(user: User): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(`${this.config.storagePrefix}user`, JSON.stringify(user));
  }

  private clearAuth(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.userSubject.next(null);
    this.currentUser.set(null);
    this.tokensSubject.next(null);

    localStorage.removeItem(`${this.config.storagePrefix}${this.config.tokenKey}`);
    localStorage.removeItem(`${this.config.storagePrefix}user`);

    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
  }

  private scheduleTokenRefresh(expiresIn: number): void {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }

    const refreshTime = (expiresIn * 1000) - this.config.refreshThreshold;
    if (refreshTime > 0) {
      this.refreshTimeout = setTimeout(() => {
        this.refreshToken().subscribe();
      }, refreshTime);
    }
  }
}
