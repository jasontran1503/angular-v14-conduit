import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import {
  MultipleCommentsResponse,
  NewComment,
  SingleCommentResponse
} from 'src/app/shared/data-access/app.models';
import { environment } from 'src/environments/environment';

@Injectable()
export class CommentService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getComments(slug: string) {
    return this.http
      .get<MultipleCommentsResponse>(`${this.apiUrl}/articles/${slug}/comments`)
      .pipe(map((res) => res.comments));
  }

  createComment(slug: string, comment: NewComment) {
    return this.http
      .post<SingleCommentResponse>(`${this.apiUrl}/articles/${slug}/comments`, { comment })
      .pipe(map((res) => res.comment));
  }

  deleteComment(slug: string, id: number) {
    return this.http.delete(`${this.apiUrl}/articles/${slug}/comments/${id}`);
  }
}
