import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (this.auth.isAuthenticated()) {
      const requiredRole = route.data?.['role'];
      if (requiredRole && !this.auth.isAdmin()) {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    }

    this.router.navigate(['/auth/login'], { queryParams: { redirect: state.url } });
    return false;
  }
}
