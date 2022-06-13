import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, EMPTY, exhaustMap, map, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ArticleService } from '../article/article.service';
import { Article } from '../shared/data-access/app.models';
import { AuthService } from '../shared/data-access/auth.service';
import { DestroyService } from '../shared/data-access/destroy.service';
import { EditorService } from './editor.service';

@Component({
  selector: 'conduit-editor',
  template: `
    <div class="editor-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-10 offset-md-1 col-xs-12">
            <form [formGroup]="form">
              <fieldset>
                <fieldset class="form-group">
                  <input
                    type="text"
                    class="form-control form-control-lg"
                    placeholder="Article Title"
                    formControlName="title"
                  />
                </fieldset>
                <fieldset class="form-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="What's this article about?"
                    formControlName="description"
                  />
                </fieldset>
                <fieldset class="form-group">
                  <textarea
                    class="form-control"
                    rows="8"
                    placeholder="Write your article (in markdown)"
                    formControlName="body"
                  ></textarea>
                </fieldset>
                <fieldset class="form-group">
                  <input
                    #tagInput
                    type="text"
                    class="form-control"
                    placeholder="Enter tags"
                    (keyup.enter)="addTag(tagInput)"
                  />
                  <div class="tag-list" *ngIf="form.value.tagList?.length">
                    <span class="tag-pill tag-default" *ngFor="let tag of form.value?.tagList">
                      <i class="ion-close-round" (click)="removeTag(tag)"></i>
                      {{ ' ' + tag }}
                    </span>
                  </div>
                </fieldset>
                <button
                  class="btn btn-lg pull-xs-right btn-primary"
                  type="button"
                  (click)="submit()"
                >
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  providers: [EditorService, ArticleService, DestroyService]
})
export class EditorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private editorService = inject(EditorService);
  private articleService = inject(ArticleService);
  private authService = inject(AuthService);

  private destroy$ = inject(DestroyService);
  private _submit$ = new Subject<void>();

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    body: ['', [Validators.required]],
    tagList: [<string[]>[]]
  });
  slug = '';

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('slug')),
        switchMap((slug) => {
          if (!slug) return EMPTY;

          this.slug = slug;
          return this.articleService.getArticleBySlug(slug);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (article) => {
          if (article.author.username === this.authService.currentUser?.username) {
            this.form.setValue({
              title: article.title,
              body: article.body,
              description: article.description,
              tagList: article.tagList
            });
          } else {
            this.router.navigate(['/']);
          }
          this.cdr.markForCheck();
        }
      });

    this._submit$
      .pipe(
        exhaustMap(() => {
          if (this.slug) {
            return this.editorService
              .updateArticle(this.slug, this.form.getRawValue())
              .pipe(catchError(() => of({} as Article)));
          }
          return this.editorService
            .createArticle(this.form.getRawValue())
            .pipe(catchError(() => of({} as Article)));
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (article) => {
          if (article && article.slug) this.router.navigate(['/', 'article', article.slug]);
        }
      });
  }

  submit() {
    this._submit$.next();
  }

  addTag(tagInput: HTMLInputElement) {
    if (tagInput.value.trim()) {
      this.form
        .get('tagList')
        ?.patchValue([...this.form.controls.tagList.value, tagInput.value.trim()]);
      tagInput.value = '';
    }
  }

  removeTag(tagRemove: string) {
    this.form.controls.tagList.patchValue(
      this.form.controls.tagList.value.filter((tag) => tag !== tagRemove)
    );
  }
}
