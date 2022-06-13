import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DestroyService } from '../shared/data-access/destroy.service';
import { ArticleListComponent } from '../shared/data-ui/article-list/article-list.component';
import { FeedComponent, FeedType } from './feed/feed.component';
import { HomeService } from './home.service';
import { TagsComponent } from './tags/tags.component';

@Component({
  selector: 'conduit-home',
  template: `<div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <conduit-feed
            (selectFeed)="selectFeed($event)"
            [selectedTag]="selectedTag"
          ></conduit-feed>

          <ng-container *ngIf="articles$ | async as articles">
            <conduit-article-list [articles]="articles"></conduit-article-list>
          </ng-container>
        </div>

        <ng-container *ngIf="tags$ | async as tags">
          <div class="col-md-3">
            <div class="sidebar">
              <p>Popular Tags</p>
              <conduit-tags [tags]="tags" (selectTag)="selectTag($event)"></conduit-tags>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TagsComponent, ArticleListComponent, FeedComponent, CommonModule],
  providers: [HomeService, DestroyService]
})
export class HomeComponent {
  private service = inject(HomeService);

  selectedTag = '';
  tags$ = this.service.getTags();
  articles$ = this.service.getGlobalFeed();

  selectFeed(feed: FeedType) {
    this.selectedTag = '';

    if (feed === 'feed') {
      this.articles$ = this.service.getYourFeed();
      return;
    }
    this.articles$ = this.service.getGlobalFeed();
  }

  selectTag(tag: string) {
    this.selectedTag = tag;
    this.articles$ = this.service.getArticlesByTag(tag);
  }
}
