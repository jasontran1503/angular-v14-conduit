import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { concatMap, map, tap } from 'rxjs';
import { LoginUser, UserResponse } from 'src/app/shared/data-access/app.models';
import { AuthService } from 'src/app/shared/data-access/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class LoginService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  login(user: LoginUser) {
    return this.http.post<UserResponse>(this.apiUrl + 'users/login', { user }).pipe(
      map((res) => res.user),
      tap((user) => {
        localStorage.setItem('conduit-token', user.token);
      }),
      concatMap(() => this.authService.getCurrentUser())
    );
  }
}
