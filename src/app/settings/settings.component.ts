import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { catchError, exhaustMap, of, Subject, takeUntil } from 'rxjs';
import { User } from '../shared/data-access/app.models';
import { AuthService } from '../shared/data-access/auth.service';
import { DestroyService } from '../shared/data-access/destroy.service';
import { SettingsService } from './settings.service';

@Component({
  selector: 'conduit-settings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form [formGroup]="form" (ngSubmit)="submit()">
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                  formControlName="image"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  formControlName="username"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                  formControlName="bio"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  formControlName="email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  formControlName="password"
                />
              </fieldset>
              <button
                type="submit"
                class="btn btn-lg btn-primary pull-xs-right"
                [disabled]="form.invalid"
              >
                Update Settings
              </button>
            </fieldset>
          </form>

          <hr />

          <button class="btn btn-outline-danger" (click)="logout()">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>`,
  imports: [ReactiveFormsModule, RouterModule],
  providers: [SettingsService, DestroyService]
})
export class SettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  private authService = inject(AuthService);
  private service = inject(SettingsService);
  private destroy$ = inject(DestroyService);
  private _submit$ = new Subject<void>();
  private currentUser = this.authService.currentUser;

  form = this.fb.nonNullable.group({
    image: [''],
    bio: [''],
    email: ['', [Validators.required, Validators.email]],
    username: [''],
    password: ['']
  });

  ngOnInit(): void {
    if (this.currentUser) {
      this.form.patchValue({
        image: this.currentUser.image,
        bio: this.currentUser.bio,
        username: this.currentUser.username,
        email: this.currentUser.email
      });
    }

    this._submit$
      .pipe(
        exhaustMap(() =>
          this.service.update(this.form.getRawValue()).pipe(catchError(() => of({} as User)))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (user) => {
          if (user && user.email) {
            this.router.navigate(['/', 'profile', user.username]);
          }
        }
      });
  }

  submit() {
    this._submit$.next();
  }

  logout() {
    localStorage.removeItem('conduit-token');
    this.authService.setUser(null);
    this.authService.setIsAuthenticated(false);
    this.router.navigate(['/']);
  }
}
