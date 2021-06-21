import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { animations } from '../../utils/animations';

@Component({
  selector: 'app-report-user-dialog',
  templateUrl: './report-user-dialog.component.html',
  styleUrls: ['./report-user-dialog.component.scss'],
  animations: [animations.dialogAnimation, animations.modalBgFadeIn]
})
export class ReportUserDialogComponent implements OnInit {
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  
  @Input()
  public companyProfile: any;

  @Output()
  public closeEventEmitter: EventEmitter<void> = new EventEmitter<void>();
  
  @Output()
  public successEventEmitter: EventEmitter<any> = new EventEmitter<any>();

  public reportUserForm: FormGroup;

  public reportShipperOptions: string[] = [
    "Unprofessional behavior",
    "Load cancellation"
  ];
  
  public reportCarrierOptions: string[] = [
    "Unprofessional behavior",
    "Load rejectection",
  ];

  constructor(
    private formBuilder: FormBuilder,
    private _ngZone: NgZone
  ) {
    this.reportUserForm = this.formBuilder.group({
      messageSummary: ['', [ Validators.required ]],
      message: ['', [ Validators.required ]]
    });
  }

  ngOnInit(): void {
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  get messageSummary() {
    return this.reportUserForm.get('messageSummary');
  }

  get message() {
    return this.reportUserForm.get('message');
  }
  
  public inputChange(event: any) {
    this.message.setValue(event.target.value);
  }

  public inputChangeMessageSummary(event: any) {
    this.messageSummary.setValue(event.value); 
  }

  public onClose() {
    this.closeEventEmitter.emit();
  }

  public onSubmit() {
    this.reportUserForm.markAllAsTouched();

    if (this.reportUserForm.valid) {
      this.successEventEmitter.emit(
        {
          messageSummary: this.messageSummary.value,
          message: this.message.value
        }
      )
    }
  }

}
