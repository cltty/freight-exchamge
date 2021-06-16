import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.scss']
})
export class NotificationDialogComponent implements OnInit {
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

  ngOnInit(): void {
  }

  public onClose() {
    console.log('onClose()');
    this.closeEventEmitter.emit();
  }

  public onAfirmative() {
    console.log('onAfirmative()');
    this.afirmativeEventEmitter.emit();
  }

}
