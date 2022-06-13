import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ProfileResponse } from 'src/app/shared/data-access/app.models';
import { environment } from 'src/environments/environment';

@Injectable()
export class FollowButtonService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  toggleFollow(following: boolean, username: string) {
    if (following) {
      return this.http
        .delete<ProfileResponse>(`${this.apiUrl}profiles/${username}/follow`)
        .pipe(map((res) => res.profile));
    }
    return this.http
      .post<ProfileResponse>(`${this.apiUrl}profiles/${username}/follow`, {})
      .pipe(map((res) => res.profile));
  }
}
