import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CompanyProfile } from 'src/app/auth/create-profile/models/CompanyProfile';
import { NotificationDialogComponent } from 'src/app/common/dialogs/notification-dialog/notification-dialog.component';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { UserService } from 'src/app/user-service/user.service';
import { Load } from '../../models/load';
import { DashboardService } from '../../service/dashboard.service';

@Component({
  selector: 'fx-loadboard',
  templateUrl: './loadboard.component.html',
  styleUrls: ['./loadboard.component.scss']
})
export class LoadboardComponent implements OnInit {
  @ViewChild('dialog', { read: ViewContainerRef })
  public dialogContainer: ViewContainerRef;

  @Input()
  public companyProfile: CompanyProfile;

  public searchCriteriaForm: FormGroup;

  public companyTypes: string[] = [
    "Shipper",
    "Carrier"
  ];

  public companyType: string;
  public availableLoads: Load[] = [];

  private closeDialogEmitterSubscription: Subscription;
  private afirmativeAnswearDialogEmitterSubscription: Subscription;


  private componentDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder, 
    private dashboardService: DashboardService,
    private userService: UserService,
    private dialogService: DialogService
    ) {
    this.searchCriteriaForm = this.formBuilder.group({
      origin: [''],
      destination: [''],
      starDate: [''],
    });
  }

  ngOnInit(): void {
    this.companyType = this.userService.getCompanyType();
    this.getAllUnbookedLoads();
  }

  public getAllUnbookedLoads() {
    this.dashboardService.getAllAvailableLoads().pipe(takeUntil(this.componentDestroyed$)).subscribe(loads => {
      this.availableLoads = loads;
    });
  }

  get companyLegalName() {
    return this.searchCriteriaForm.get('origin');
  }

  public bookLoad(index: number) {
    this.dialogService.showDialog(this.dialogContainer, NotificationDialogComponent, this.computeConfirmationDialogInputs());

    this.dialogService.closeEventEmitter().subscribe(() => {
      this.dialogService.hideDialog([
        this.closeDialogEmitterSubscription,
        this.afirmativeAnswearDialogEmitterSubscription
      ]);
    });

    this.dialogService.trueEventEmitter().subscribe(() => {
      this.dialogService.hideDialog([
        this.closeDialogEmitterSubscription,
        this.afirmativeAnswearDialogEmitterSubscription
      ]);

      this.dashboardService
        .bookLoad(this.availableLoads[index]._id, this.computeBookPayload())
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe(
          () => {
            setTimeout(() => {
              this.openLoadBookedDialog(index);    
            }, 1000);
          },
          () => {
            this.openLoadBookFailedDialog();
          }
      );
    });
  }

  private computeBookPayload() {
    return {
      carrierId: this.userService.getUserId(),
      carrierCompanyLegalName: this.companyProfile.companyDetails.companyLegalName,
      carrierEmailAddress: this.companyProfile.emailAddress,
      carrierPhoneNumber: this.companyProfile.companyDetails.phoneNumber
    }
  }

  private openLoadBookedDialog(index: number) {
    this.dialogService.showDialog(this.dialogContainer, NotificationDialogComponent, this.computeLoadBookedDialogInputs());

    this.dialogService.closeEventEmitter().subscribe(() => {
      this.dialogService.hideDialog([
        this.closeDialogEmitterSubscription,
        this.afirmativeAnswearDialogEmitterSubscription
      ]);

      this.dashboardService.createNotification(this.computeLoadBookedNotificationPayload(index)).pipe(takeUntil(this.componentDestroyed$)).subscribe();
      
      this.getAllUnbookedLoads();
    });

    this.dialogService.trueEventEmitter().subscribe(() => {
      this.dialogService.hideDialog([
        this.closeDialogEmitterSubscription,
        this.afirmativeAnswearDialogEmitterSubscription
      ]);
      
      this.dashboardService.createNotification(this.computeLoadBookedNotificationPayload(index)).pipe(takeUntil(this.componentDestroyed$)).subscribe();
      
      this.getAllUnbookedLoads();
    });
  }

  private openLoadBookFailedDialog() {
    this.dialogService.showDialog(this.dialogContainer, NotificationDialogComponent, this.computeLoadBookFailedDialogInputs());

    this.dialogService.closeEventEmitter().subscribe(() => {
      this.dialogService.hideDialog([
        this.closeDialogEmitterSubscription,
        this.afirmativeAnswearDialogEmitterSubscription
      ]);

      this.getAllUnbookedLoads();
    });

    this.dialogService.trueEventEmitter().subscribe(() => {
      this.dialogService.hideDialog([
        this.closeDialogEmitterSubscription,
        this.afirmativeAnswearDialogEmitterSubscription
      ]);

      this.getAllUnbookedLoads();
    });
  }

  private computeLoadBookedNotificationPayload(index: number) {
    return {
      read: false,
      for: {
        userId: this.availableLoads[index].shipperDetails.shipperId,
        companyLegalName: this.availableLoads[index].shipperDetails.shipperName,
        companyEmailAddress: this.availableLoads[index].shipperDetails.shipperEmailAddress,
        companyPhoneNumber: this.availableLoads[index].shipperDetails.shipperPhoneNumber
      },
      from: {
        userId: this.userService.getUserId(),
        companyLegalName: this.companyProfile.companyDetails.companyLegalName,
        companyEmailAddress: this.companyProfile.emailAddress,
        companyPhoneNumber: this.companyProfile.companyDetails.phoneNumber,
      },
      messageSummary: "Load booked by " + this.companyProfile.companyDetails.companyLegalName,
      message: "Load " + this.availableLoads[index].origin.city + "("+ this.availableLoads[index].origin.arrival + ")" + " - " + this.availableLoads[index].destination.city
        + "("+ this.availableLoads[index].destination.arrival + ")" + " has just been booked"
    }
  }

  private computeConfirmationDialogInputs() {
    return [
      {
        name: 'headerText',
        value: 'Are you sure you want to book this load?'
      },
      {
        name: 'displayCancel',
        value: true
      },
      {
        name: 'displayAfirmative',
        value: true
      },
      {
        name: 'leftButtonText',
        value: 'No'
      },
      {
        name: 'rightButtonText',
        value: 'Yes'
      },
    ];
  }

  private computeLoadBookedDialogInputs() {
    return [
      {
        name: 'headerText',
        value: 'Load successfully booked!'
      },
      {
        name: 'displayCancel',
        value: false
      },
      {
        name: 'rightButtonText',
        value: 'Ok'
      },
      {
        name: 'displayAfirmative',
        value: true
      },
    ];
  }

  private computeLoadBookFailedDialogInputs() {
    return [
      {
        name: 'headerText',
        value: 'Booking load failed! Please refresh.'
      },
      {
        name: 'leftButtonText',
        value: 'Ok'
      },
      {
        name: 'displayCancel',
        value: true
      },
      {
        name: 'displayAfirmative',
        value: false
      },
    ];
  }
}
