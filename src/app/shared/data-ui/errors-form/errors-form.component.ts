import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'conduit-errors-form',
  template: `
    <ul class="error-messages" *ngIf="errorList">
      <li *ngFor="let error of errorList">
        {{ error }}
      </li>
    </ul>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class ErrorsFormComponent {
  private _errors?: string[];
  @Input() set errors(value: { [key: string]: string[] }) {
    if (value) {
      this._errors = Object.keys(value).map((key) => `${key} ${value[key]}`);
    }
  }

  get errorList() {
    return this._errors;
  }
}
