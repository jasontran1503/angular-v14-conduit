import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Article } from '../../data-access/app.models';

@Component({
  selector: 'conduit-article-meta[article]',
  template: `
    <div class="article-meta" *ngIf="article">
      <a [routerLink]="['/profile', article.author.username]">
        <img [src]="article.author.image" alt="Avatar of article author" />
      </a>
      <div class="info">
        <a [routerLink]="['/profile', article.author.username]" class="author">
          {{ article.author.username }}
        </a>
        <span class="date">
          {{ article.updatedAt | date: 'mediumDate' }}
        </span>
      </div>
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ArticleMetaComponent {
  @Input() article!: Article;
}
