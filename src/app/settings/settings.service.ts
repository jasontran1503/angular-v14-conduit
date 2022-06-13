import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UpdateUser, UserResponse } from '../shared/data-access/app.models';

@Injectable()
export class SettingsService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  update(user: UpdateUser) {
    return this.http.put<UserResponse>(this.apiUrl + 'user', { user }).pipe(map((res) => res.user));
  }
}
