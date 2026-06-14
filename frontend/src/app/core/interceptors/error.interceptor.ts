import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private isLoggedOut = false;

  constructor(
    private injector: Injector,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isLoggedOut && req.url.includes('auth/logout')) {
      return throwError(() => new Error('Already logged out'));
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !req.url.includes('auth/login') && !req.url.includes('auth/refresh') && !req.url.includes('auth/logout')) {
          return this.handle401Error(req, next);
        }

        if (error.status === 403) {
          this.router.navigate(['/']);
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      const auth = this.injector.get(AuthService);

      return auth.refreshToken().pipe(
        switchMap(tokens => {
          this.isRefreshing = false;
          return next.handle(this.addToken(req, tokens.accessToken));
        }),
        catchError(error => {
          this.isRefreshing = false;
          if (!this.isLoggedOut) {
            this.isLoggedOut = true;
            auth.logout();
            this.router.navigate(['/auth/login']);
          }
          return throwError(() => error);
        })
      );
    }

    return next.handle(req);
  }

  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
