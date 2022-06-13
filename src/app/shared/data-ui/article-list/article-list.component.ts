import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Article } from '../../data-access/app.models';
import { ArticleMetaComponent } from '../article-meta/article-meta.component';
import { FavoriteButtonComponent } from '../buttons/favorite-button/favorite-button.component';

@Component({
  selector: 'conduit-article-list',
  template: `
    <ng-container *ngIf="articles && articles.length; else noArticles">
      <ng-container *ngFor="let article of articles">
        <div class="article-preview">
          <conduit-article-meta [article]="article">
            <conduit-favorite-button
              class="pull-xs-right"
              [isFavorited]="article.favorited"
              [slug]="article.slug"
              (toggleFavorite)="toggleFavorite($event)"
              >{{ article.favoritesCount }}
            </conduit-favorite-button>
          </conduit-article-meta>

          <a [routerLink]="['/', 'article', article.slug]" class="preview-link">
            <h1>{{ article.title }}</h1>
            <p>{{ article.description }}</p>
            <span>Read more...</span>
            <ul class="tag-list">
              <li class="tag-default tag-pill tag-outline" *ngFor="let tag of article.tagList">
                {{ tag }}
              </li>
            </ul>
          </a>
        </div>
      </ng-container>
    </ng-container>
    <ng-template #noArticles
      ><div class="article-preview">No articles are here...yet</div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, ArticleMetaComponent, FavoriteButtonComponent],
  standalone: true
})
export class ArticleListComponent {
  @Input() articles: Article[] = [];

  toggleFavorite(article: Article) {
    this.articles = [...this.articles].map((item) => (item.slug === article.slug ? article : item));
  }
}
