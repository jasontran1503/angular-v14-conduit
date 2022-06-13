import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { concatMap, map, tap } from 'rxjs';
import { NewUser, UserResponse } from 'src/app/shared/data-access/app.models';
import { AuthService } from 'src/app/shared/data-access/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class RegisterService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  register(user: NewUser) {
    return this.http.post<UserResponse>(this.apiUrl + 'users', { user }).pipe(
      map((res) => res.user),
      tap((user) => {
        localStorage.setItem('conduit-token', user.token);
      }),
      concatMap(() => this.authService.getCurrentUser())
    );
  }
}
