import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { finalize, takeUntil } from 'rxjs';
import { AuthService } from './shared/data-access/auth.service';
import { DestroyService } from './shared/data-access/destroy.service';

@Component({
  selector: 'conduit-root',
  template: `<ng-container *ngIf="status === 'completed'">
    <router-outlet></router-outlet>
  </ng-container>`,
  standalone: true,
  imports: [RouterModule, CommonModule],
  providers: [DestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = inject(DestroyService);
  private authService = inject(AuthService);

  status: 'loading' | 'completed' = 'completed';

  ngOnInit(): void {
    const token = localStorage.getItem('conduit-token');
    if (token) {
      this.status = 'loading';
      this.authService
        .getCurrentUser()
        .pipe(
          finalize(() => {
            this.status = 'completed';
            this.cdr.markForCheck();
          }),
          takeUntil(this.destroy$)
        )
        .subscribe();
      return;
    }

    this.authService.setUser(null);
    this.authService.setIsAuthenticated(false);
  }
}
