import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'conduit-tags',
  template: `
    <div class="tag-list">
      <a class="tag-pill tag-default" *ngFor="let tag of tags" (click)="onSelectTag(tag)">{{
        tag
      }}</a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule]
})
export class TagsComponent {
  @Input() tags: string[] = [];
  @Output() selectTag = new EventEmitter<string>();

  onSelectTag(tag: string) {
    this.selectTag.emit(tag);
  }
}
