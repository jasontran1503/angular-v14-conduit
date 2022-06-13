import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  tap
} from 'rxjs';
import { Article } from '../shared/data-access/app.models';
import { AuthService } from '../shared/data-access/auth.service';
import { ArticleListComponent } from '../shared/data-ui/article-list/article-list.component';
import { FollowButtonComponent } from '../shared/data-ui/buttons/follow-button/follow-button.component';
import { ProfileService } from './profile.service';

@Component({
  selector: 'conduit-profile',
  template: `
    <ng-container *ngIf="profile$ | async as profile">
      <div class="profile-page">
        <div class="user-info">
          <div class="container">
            <div class="row">
              <div class="col-xs-12 col-md-10 offset-md-1">
                <img [src]="profile.image" class="user-img" />
                <h4>{{ profile.username }}</h4>
                <p>
                  {{ profile.bio }}
                </p>
                <ng-container *ngIf="isOwner; else nonOwner">
                  <button
                    class="btn btn-sm btn-outline-secondary action-btn"
                    routerLink="/settings"
                  >
                    <i class="ion-gear-a"></i>
                    &nbsp; Edit profile settings
                  </button>
                </ng-container>
                <ng-template #nonOwner>
                  <conduit-follow-button
                    [following]="profile.following"
                    [username]="profile.username"
                  ></conduit-follow-button>
                </ng-template>
              </div>
            </div>
          </div>
        </div>

        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-md-10 offset-md-1">
              <div class="articles-toggle">
                <ul class="nav nav-pills outline-active">
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      [class.active]="articlesType === 'author'"
                      (click)="onSelectArticles('author')"
                      >My Articles</a
                    >
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      [class.active]="articlesType === 'favorited'"
                      (click)="onSelectArticles('favorited')"
                      >Favorited Articles</a
                    >
                  </li>
                </ul>
              </div>

              <ng-container *ngIf="articles$ | async as articles">
                <conduit-article-list [articles]="articles"></conduit-article-list>
              </ng-container>
            </div>
          </div>
        </div>
      </div>
    </ng-container>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArticleListComponent, FollowButtonComponent, RouterModule, CommonModule],
  providers: [ProfileService]
})
export class ProfileComponent {
  private route = inject(ActivatedRoute);
  private service = inject(ProfileService);
  private authService = inject(AuthService);
  private _changeArticlesType$ = new BehaviorSubject<ArticlesType>('author');

  isOwner = false;
  articlesType: ArticlesType = 'author';
  username = '';

  articles$!: Observable<Article[]>;
  profile$ = this.route.paramMap.pipe(
    map((params) => params.get('username')),
    switchMap((username) => {
      if (!username) {
        return EMPTY;
      }
      return this.service.getProfile(username).pipe(
        tap(() => (this.username = username)),
        mergeMap((profile) => {
          this.articles$ = this._changeArticlesType$.pipe(
            switchMap(() =>
              this.service
                .getArticles(this.articlesType, this.username)
                .pipe(catchError(() => of([] as Article[])))
            )
          );
          return of(profile);
        }),
        tap((profile) => {
          if (profile.username === this.authService.currentUser?.username) {
            this.isOwner = true;
            return;
          }
          this.isOwner = false;
        })
      );
    })
  );

  onSelectArticles(type: ArticlesType) {
    this.articlesType = type;
    this._changeArticlesType$.next(this.articlesType);
  }
}

type ArticlesType = 'author' | 'favorited';
