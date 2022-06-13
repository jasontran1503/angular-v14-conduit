import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MultipleArticlesResponse, ProfileResponse } from '../shared/data-access/app.models';

@Injectable()
export class ProfileService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getProfile(username: string) {
    return this.http
      .get<ProfileResponse>(`${this.apiUrl}/profiles/${username}`)
      .pipe(map((res) => res.profile));
  }

  getArticles(articlesType: string, username: string) {
    return this.http
      .get<MultipleArticlesResponse>(`${this.apiUrl}/articles?${articlesType}=${username}`)
      .pipe(map((res) => res.articles));
  }
}
