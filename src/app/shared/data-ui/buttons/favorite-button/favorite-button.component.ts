import { CommonModule } from '@angular/common';
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
import { Article } from 'src/app/shared/data-access/app.models';
import { DestroyService } from 'src/app/shared/data-access/destroy.service';
import { FavoriteButtonService } from './favorite-button.service';

@Component({
  selector: 'conduit-favorite-button',
  template: `<button
    class="btn btn-sm"
    [ngClass]="isFavorited ? 'btn-primary' : 'btn-outline-primary'"
    (click)="click()"
  >
    <i class="ion-heart"></i>&nbsp;
    <ng-content></ng-content>
  </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
  providers: [FavoriteButtonService, DestroyService]
})
export class FavoriteButtonComponent implements OnInit {
  @Input() isFavorited = false;
  @Input() slug = '';
  @Output() toggleFavorite = new EventEmitter<Article>();

  private cdr = inject(ChangeDetectorRef);
  private service = inject(FavoriteButtonService);
  private destroy$ = inject(DestroyService);
  private _click$ = new Subject<void>();

  ngOnInit() {
    this._click$
      .pipe(
        exhaustMap(() =>
          this.service
            .toggleFavorite(this.isFavorited, this.slug)
            .pipe(catchError(() => of({} as Article)))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (article) => {
          if (article && article.slug) {
            this.toggleFavorite.emit(article);
            this.cdr.markForCheck();
          }
        }
      });
  }

  click() {
    this._click$.next();
  }
}
