import { Component, Input, Output, TemplateRef, EventEmitter } from '@angular/core';
import { animations } from '../../utils/animations';

@Component({
  selector: 'fx-common-dialog',
  templateUrl: './common-dialog.component.html',
  styleUrls: ['./common-dialog.component.scss'],
  animations: [animations.dialogAnimation, animations.modalBgFadeIn]
})
export class CommonDialogComponent {
  @Input()
  public headerTemplate: TemplateRef<any>;

  @Input()
  public contentTemplate: TemplateRef<any>;
}
