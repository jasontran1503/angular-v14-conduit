import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, EMPTY, exhaustMap, map, of, Subject, switchMap, takeUntil } from 'rxjs';
import { Article, Profile } from '../shared/data-access/app.models';
import { AuthService } from '../shared/data-access/auth.service';
import { DestroyService } from '../shared/data-access/destroy.service';
import { ArticleMetaComponent } from '../shared/data-ui/article-meta/article-meta.component';
import { ButtonsComponent } from '../shared/data-ui/buttons/buttons.component';
import { ArticleService } from './article.service';
import { CommentComponent } from './comment/comment.component';

@Component({
  selector: 'conduit-article',
  template: `
    <ng-container *ngIf="article">
      <div class="article-page">
        <div class="banner">
          <div class="container">
            <h1>{{ article.title }}</h1>

            <conduit-article-meta [article]="article">
              <conduit-buttons
                [isOwner]="isOwner"
                [article]="article"
                (toggleFavorite)="toggleFavorite($event)"
                (toggleFollow)="toggleFollow($event)"
                (deleteArticle)="deleteArticle()"
              ></conduit-buttons>
            </conduit-article-meta>
          </div>
        </div>

        <div class="container page">
          <div class="row article-content">
            <div class="col-md-12">
              <p>{{ article.body }}</p>
            </div>
          </div>

          <hr />

          <div class="article-actions">
            <conduit-article-meta [article]="article">
              <conduit-buttons
                [isOwner]="isOwner"
                [article]="article"
                (toggleFavorite)="toggleFavorite($event)"
                (toggleFollow)="toggleFollow($event)"
                (deleteArticle)="deleteArticle()"
              ></conduit-buttons>
            </conduit-article-meta>
          </div>

          <div class="row">
            <div class="col-xs-12 col-md-8 offset-md-2">
              <conduit-comment [currentUser]="currentUser" [slug]="slug"></conduit-comment>
            </div>
          </div>
        </div>
      </div>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, ArticleMetaComponent, ButtonsComponent, CommentComponent],
  standalone: true,
  providers: [ArticleService, DestroyService]
})
export class ArticleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  private service = inject(ArticleService);
  private authService = inject(AuthService);
  private destroy$ = inject(DestroyService);

  private _delete$ = new Subject<void>();

  article!: Article;
  isOwner = false;
  slug = '';
  currentUser = this.authService.currentUser!;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('slug')),
        switchMap((slug) => {
          if (!slug) {
            return EMPTY;
          }
          this.slug = slug;
          return this.service.getArticleBySlug(slug);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (article) => {
          this.article = article;
          article.author.username === this.currentUser?.username
            ? (this.isOwner = true)
            : (this.isOwner = false);
          this.cdr.markForCheck();
        }
      });

    this._delete$
      .pipe(
        exhaustMap(() => this.service.deleteArticle(this.slug).pipe(catchError(() => of(null)))),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.router.navigate(['/']);
            this.cdr.markForCheck();
          }
        }
      });
  }

  toggleFavorite(article: Article) {
    this.article = article;
  }

  toggleFollow(author: Profile) {
    this.article = { ...this.article, author };
  }

  deleteArticle() {
    this._delete$.next();
  }
}
