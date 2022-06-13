import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { catchError, exhaustMap, of, Subject, takeUntil } from 'rxjs';
import { Profile } from 'src/app/shared/data-access/app.models';
import { DestroyService } from 'src/app/shared/data-access/destroy.service';
import { FollowButtonService } from './follow-button.service';

@Component({
  selector: 'conduit-follow-button',
  template: `<button class="btn btn-sm btn-outline-secondary action-btn" (click)="click()">
    <i class="ion-plus-round"></i>
    &nbsp; {{ following ? 'Unfollow' : 'Follow' }} {{ username }}
  </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
  providers: [FollowButtonService, DestroyService]
})
export class FollowButtonComponent implements OnInit {
  @Input() following = false;
  @Input() username = '';
  @Output() toggleFollow = new EventEmitter<Profile>();

  private cdr = inject(ChangeDetectorRef);
  private service = inject(FollowButtonService);
  private destroy$ = inject(DestroyService);
  private _click$ = new Subject<void>();

  ngOnInit() {
    this._click$
      .pipe(
        exhaustMap(() =>
          this.service
            .toggleFollow(this.following, this.username)
            .pipe(catchError(() => of({} as Profile)))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (profile) => {
          if (profile && profile.username) {
            this.following = !this.following;
            this.toggleFollow.emit(profile);
            this.cdr.markForCheck();
          }
        }
      });
  }

  click() {
    this._click$.next();
  }
}
