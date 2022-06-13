import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MultipleArticlesResponse, TagsResponse } from '../shared/data-access/app.models';

@Injectable()
export class HomeService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getTags() {
    return this.http.get<TagsResponse>(this.apiUrl + 'tags').pipe(map((res) => res.tags));
  }

  getYourFeed() {
    return this.http
      .get<MultipleArticlesResponse>(this.apiUrl + 'articles/feed')
      .pipe(map((res) => res.articles));
  }

  getGlobalFeed() {
    return this.http
      .get<MultipleArticlesResponse>(this.apiUrl + 'articles')
      .pipe(map((res) => res.articles));
  }

  getArticlesByTag(tag: string) {
    return this.http
      .get<MultipleArticlesResponse>(this.apiUrl + 'articles', { params: { tag } })
      .pipe(map((res) => res.articles));
  }
}
