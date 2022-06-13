import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output
} from '@angular/core';
import { AuthService } from 'src/app/shared/data-access/auth.service';

@Component({
  selector: 'conduit-feed',
  template: `<div class="feed-toggle">
    <ul class="nav nav-pills outline-active">
      <li class="nav-item">
        <a
          class="nav-link"
          [class.active]="feedType === 'feed' && !selectedTag"
          (click)="onSelectFeed('feed')"
          >Your Feed</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          [class.active]="feedType === 'global' && !selectedTag"
          (click)="onSelectFeed('global')"
          >Global Feed</a
        >
      </li>
      <li class="nav-item" *ngIf="selectedTag">
        <a class="nav-link active">#{{ selectedTag }}</a>
      </li>
    </ul>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule]
})
export class FeedComponent {
  private authService = inject(AuthService);

  feedType: FeedType = 'global';
  isAuthenticated = this.authService.isAuthenticated;

  @Input() selectedTag = '';
  @Output() selectFeed = new EventEmitter<FeedType>();

  onSelectFeed(feedType: FeedType) {
    this.feedType = feedType;
    this.selectFeed.emit(feedType);
  }
}

export type FeedType = 'feed' | 'global';
