import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { takeUntil } from 'rxjs';
import { User } from 'src/app/shared/data-access/app.models';
import { AuthService } from 'src/app/shared/data-access/auth.service';
import { DestroyService } from 'src/app/shared/data-access/destroy.service';

@Component({
  selector: 'conduit-header',
  template: `
    <nav class="navbar navbar-light">
      <div class="container">
        <a class="navbar-brand" routerLink="/">conduit</a>
        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <a
              class="nav-link"
              routerLink="/"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
              >Home</a
            >
          </li>
          <ng-container *ngIf="currentUser; else nonAuthenticated">
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/editor"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
              >
                <i class="ion-compose"></i>&nbsp;New Article
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/settings"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
              >
                <i class="ion-gear-a"></i>&nbsp;Settings
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                [routerLink]="['', 'profile', currentUser.username]"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
                >{{ currentUser.username }}</a
              >
            </li>
          </ng-container>
          <ng-template #nonAuthenticated>
            <li class="nav-item" *ngIf="!currentUser">
              <a
                class="nav-link"
                routerLink="/login"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
                >Sign in</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/register"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
                >Sign up</a
              >
            </li>
          </ng-template>
        </ul>
      </div>
    </nav>
  `,
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [DestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);

  private authService = inject(AuthService);
  private destroy$ = inject(DestroyService);

  currentUser: User | null = null;

  ngOnInit(): void {
    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (user) => {
        this.currentUser = user;
        this.cdr.markForCheck();
      }
    });
  }
}
