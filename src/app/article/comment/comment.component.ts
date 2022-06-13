import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { catchError, exhaustMap, map, of, Subject, takeUntil, tap } from 'rxjs';
import { Comment, User } from 'src/app/shared/data-access/app.models';
import { DestroyService } from 'src/app/shared/data-access/destroy.service';
import { CommentService } from './comment.service';

@Component({
  selector: 'conduit-comment[currentUser]',
  template: `<form class="card comment-form" [formGroup]="form" (ngSubmit)="submit()">
      <div class="card-block">
        <textarea
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
          formControlName="body"
        ></textarea>
      </div>
      <div class="card-footer">
        <img [src]="currentUser.image" class="comment-author-img" />
        <button type="submit" class="btn btn-sm btn-primary" [disabled]="form.invalid">
          Post Comment
        </button>
      </div>
    </form>

    <ng-container *ngIf="comments.length">
      <div class="card" *ngFor="let comment of comments">
        <div class="card-block">
          <p class="card-text">
            {{ comment.body }}
          </p>
        </div>
        <div class="card-footer">
          <a [routerLink]="['/profile', comment.author.username]" class="comment-author">
            <img [src]="comment.author.image" class="comment-author-img" />
          </a>
          &nbsp;
          <a [routerLink]="['/profile', comment.author.username]" class="comment-author">{{
            comment.author.username
          }}</a>
          <span class="date-posted">{{ comment.updatedAt | date: 'mediumDate' }}</span>
          <span class="mod-options" *ngIf="currentUser.username === comment.author.username">
            <i class="ion-trash-a" (click)="deleteComment(comment.id)"></i>
          </span>
        </div>
      </div>
    </ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  providers: [CommentService, DestroyService]
})
export class CommentComponent implements OnInit {
  @Input() currentUser!: User;
  @Input() slug = '';

  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  private service = inject(CommentService);
  private destroy$ = inject(DestroyService);

  private _create$ = new Subject<void>();
  private _delete$ = new Subject<number>();

  form = this.fb.nonNullable.group({
    body: ['', Validators.required]
  });
  comments: Comment[] = [];

  ngOnInit(): void {
    this.service
      .getComments(this.slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (comments) => {
          this.comments = comments;
          this.cdr.markForCheck();
        }
      });

    this._create$
      .pipe(
        exhaustMap(() =>
          this.service
            .createComment(this.slug, this.form.getRawValue())
            .pipe(catchError(() => of({} as Comment)))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (comment) => {
          if (comment && comment.body) {
            this.comments = [...this.comments, comment];
            this.form.reset();
            this.cdr.markForCheck();
          }
        }
      });

    this._delete$
      .pipe(
        map((id) => id),
        exhaustMap((id) =>
          this.service.deleteComment(this.slug, id).pipe(
            tap(() => (this.comments = this.comments.filter((comment) => comment.id !== id))),
            catchError(() => of(null))
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res) => {
          if (res) this.cdr.markForCheck();
        }
      });
  }

  submit() {
    this._create$.next();
  }

  deleteComment(id: number) {
    this._delete$.next(id);
  }
}
