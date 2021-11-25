import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.scss']
})
export class NotificationDialogComponent {
  @Input()
  public headerText: string;

  @Input()
  public leftButtonText: string;

  @Input()
  public rightButtonText: string;

  @Input()
  public displayCancel: boolean;

  @Input()
  public displayAfirmative: boolean;

  @Output()
  public closeEventEmitter: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public afirmativeEventEmitter: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  public onClose() {
    this.closeEventEmitter.emit();
  }

  public onAfirmative() {
    this.afirmativeEventEmitter.emit();
  }

}
