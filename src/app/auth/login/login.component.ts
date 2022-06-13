import { CommonModule } from '@angular/common';
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
import { User } from 'src/app/shared/data-access/app.models';
import { DestroyService } from 'src/app/shared/data-access/destroy.service';
import { ErrorsFormComponent } from 'src/app/shared/data-ui/errors-form/errors-form.component';
import { AuthComponent } from '../auth.component';
import { LoginService } from './login.service';

@Component({
  selector: 'conduit-login',
  template: `<conduit-auth>
    <h1 class="text-xs-center">Sign in</h1>
    <p class="text-xs-center">
      <a routerLink="/register">Need an account?</a>
    </p>

    <conduit-errors-form *ngIf="errors" [errors]="errors"></conduit-errors-form>

    <form [formGroup]="form" (ngSubmit)="submit()">
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
      <button type="submit" class="btn btn-lg btn-primary pull-xs-right" [disabled]="form.invalid">
        Sign in
      </button>
    </form>
  </conduit-auth>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AuthComponent, ErrorsFormComponent, ReactiveFormsModule, RouterModule, CommonModule],
  providers: [LoginService, DestroyService]
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  private service = inject(LoginService);
  private destroy$ = inject(DestroyService);
  private _submit$ = new Subject<boolean>();

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
  errors?: { [key: string]: string[] };

  ngOnInit(): void {
    this._submit$
      .pipe(
        exhaustMap(() =>
          this.service.login(this.form.getRawValue()).pipe(
            catchError((error) => {
              this.errors = error.error.errors;
              this.cdr.markForCheck();
              return of({} as User);
            })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (user) => {
          if (user && user.username) {
            this.router.navigate(['/']);
          }
        }
      });
  }

  submit() {
    this._submit$.next(true);
  }
}
