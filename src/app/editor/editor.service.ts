import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NewArticle, SingleArticleResponse, UpdateArticle } from '../shared/data-access/app.models';

@Injectable()
export class EditorService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  createArticle(article: NewArticle) {
    return this.http
      .post<SingleArticleResponse>(this.apiUrl + 'articles', { article })
      .pipe(map((res) => res.article));
  }

  updateArticle(slug: string, article: UpdateArticle) {
    return this.http
      .put<SingleArticleResponse>(this.apiUrl + 'articles/' + slug, { article })
      .pipe(map((res) => res.article));
  }
}
