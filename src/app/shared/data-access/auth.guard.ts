import { inject, Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Router } from '@angular/router';
import { take } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  private authService = inject(AuthService);
  private router = inject(Router);

  canLoad() {
    return this.isAuthenticated();
  }

  canActivate() {
    return this.isAuthenticated();
  }

  canActivateChild() {
    return this.isAuthenticated();
  }

  private isAuthenticated() {
    return this.authService.isAuthenticated$.pipe(
      map((isAuthenticated) => {
        if (isAuthenticated) return isAuthenticated;
        return this.router.parseUrl('/');
      }),
      take(1)
    );
  }
}
