import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Article, Profile } from '../../data-access/app.models';
import { FavoriteButtonComponent } from './favorite-button/favorite-button.component';
import { FollowButtonComponent } from './follow-button/follow-button.component';

@Component({
  selector: 'conduit-buttons[article]',
  template: `
    <ng-container *ngIf="isOwner; else nonOwner">
      <a class="btn btn-outline-secondary btn-sm" [routerLink]="['/editor', article.slug]">
        <i class="ion-edit"></i>
        Edit Article
      </a>
      <button
        style="margin-left: 0.5rem;"
        class="btn btn-outline-danger btn-sm"
        (click)="deleteArticle.emit()"
      >
        <i class="ion-trash-a"></i>
        Delete Article
      </button>
    </ng-container>

    <ng-template #nonOwner>
      <conduit-follow-button
        [following]="article.author.following"
        [username]="article.author.username"
        (toggleFollow)="onToggleFollow($event)"
      ></conduit-follow-button>
      &nbsp;&nbsp;
      <conduit-favorite-button
        [isFavorited]="article.favorited"
        [slug]="article.slug"
        (toggleFavorite)="onToggleFavorite($event)"
      >
        &nbsp; {{ article.favorited ? 'Unfavorite' : 'Favorite' }} Post
        <span class="counter">({{ article.favoritesCount }})</span>
      </conduit-favorite-button>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FollowButtonComponent, FavoriteButtonComponent, CommonModule, RouterModule]
})
export class ButtonsComponent {
  @Input() isOwner = false;
  @Input() article!: Article;

  @Output() toggleFavorite = new EventEmitter<Article>();
  @Output() toggleFollow = new EventEmitter<Profile>();
  @Output() deleteArticle = new EventEmitter<void>();

  onToggleFollow(profile: Profile) {
    this.toggleFollow.emit(profile);
  }

  onToggleFavorite(article: Article) {
    this.toggleFavorite.emit(article);
  }
}
