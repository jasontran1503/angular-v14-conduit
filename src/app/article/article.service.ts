import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SingleArticleResponse } from '../shared/data-access/app.models';

@Injectable()
export class ArticleService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getArticleBySlug(slug: string) {
    return this.http
      .get<SingleArticleResponse>(`${this.apiUrl}/articles/${slug}`)
      .pipe(map((res) => res.article));
  }

  deleteArticle(slug: string) {
    return this.http.delete(`${this.apiUrl}/articles/${slug}`);
  }
}
