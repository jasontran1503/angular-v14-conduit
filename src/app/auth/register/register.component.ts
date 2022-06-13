import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { exhaustMap, of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { User } from 'src/app/shared/data-access/app.models';
import { DestroyService } from 'src/app/shared/data-access/destroy.service';
import { ErrorsFormComponent } from 'src/app/shared/data-ui/errors-form/errors-form.component';
import { AuthComponent } from '../auth.component';
import { RegisterService } from './register.service';

@Component({
  selector: 'conduit-register',
  template: `<conduit-auth>
    <h1 class="text-xs-center">Sign up</h1>
    <p class="text-xs-center">
      <a routerLink="/login">Have an account?</a>
    </p>

    <conduit-errors-form *ngIf="errors" [errors]="errors"></conduit-errors-form>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <fieldset class="form-group">
        <input
          class="form-control form-control-lg"
          type="text"
          placeholder="Your Name"
          formControlName="username"
        />
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
      <button type="submit" class="btn btn-lg btn-primary pull-xs-right" [disabled]="form.invalid">
        Sign up
      </button>
    </form>
  </conduit-auth>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AuthComponent, ErrorsFormComponent, ReactiveFormsModule, RouterModule, CommonModule],
  providers: [RegisterService, DestroyService]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  private service = inject(RegisterService);
  private destroy$ = inject(DestroyService);
  private _submit$ = new Subject<void>();

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });
  errors?: { [key: string]: string[] };

  ngOnInit(): void {
    this._submit$
      .pipe(
        exhaustMap(() =>
          this.service.register(this.form.getRawValue()).pipe(
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
    this._submit$.next();
  }
}
