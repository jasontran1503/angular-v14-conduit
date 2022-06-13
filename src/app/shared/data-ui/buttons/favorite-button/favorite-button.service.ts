import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { SingleArticleResponse } from 'src/app/shared/data-access/app.models';
import { environment } from 'src/environments/environment';

@Injectable()
export class FavoriteButtonService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  toggleFavorite(isFavorited: boolean, slug: string) {
    if (isFavorited) {
      return this.http
        .delete<SingleArticleResponse>(`${this.apiUrl}articles/${slug}/favorite`)
        .pipe(map((res) => res.article));
    }
    return this.http
      .post<SingleArticleResponse>(`${this.apiUrl}articles/${slug}/favorite`, {})
      .pipe(map((res) => res.article));
  }
}
