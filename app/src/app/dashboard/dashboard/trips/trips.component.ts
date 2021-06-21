import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CompanyProfile } from 'src/app/auth/create-profile/models/CompanyProfile';
import { NewLoadDialogComponent } from 'src/app/common/dialogs/new-load-dialog/new-load-dialog.component';
import { NotificationDialogComponent } from 'src/app/common/dialogs/notification-dialog/notification-dialog.component';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { UserService } from 'src/app/user-service/user.service';
import { Load } from '../../models/load';
import { Notification } from '../../models/notification';
import { DashboardService } from '../../service/dashboard.service';

@Component({
  selector: 'fx-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.scss']
})
export class TripsComponent implements OnInit {
  @ViewChild('dialog', { read: ViewContainerRef })
  public dialogContainer: ViewContainerRef;
  
  @Input()
  public companyProfile: CompanyProfile;

  public companyType: string;
  public loads: Load[] = [];

  private closeDialogEmitterSubscription: Subscription;
  private trueAnswearDialogEmitterSubscription: Subscription;

  private componentDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    private userService: UserService,
    private dashboardService: DashboardService,
    public dialog: MatDialog,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.getCompanyType();
  }

  private getLoads() {
    switch(this.companyType) {
      case 'Carrier': {
        this.getCarrierBookedLoads();
        break;
      }
      case 'Shipper': {
        this.getShipperCreatedLoads();
      }
    }
  }

  private getShipperCreatedLoads() {
    this.dashboardService.getLoadsByShipperId(this.userService.getUserId())
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(loads => {
        this.loads = loads;
      });
  }

  private getCarrierBookedLoads() {
    this.dashboardService.getLoadsByCarrierId(this.userService.getUserId())
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(loads => {
        this.loads = loads;
      });
  }

  private getCompanyType() {
    this.companyType = this.userService.getCompanyType();
    this.getLoads();
  }

  public cancelLoad(index: number, workOpportunity: any) {
    this.openCancelLoadDialog(index, workOpportunity);
  }

  public rejectLoad(index: number) {
    this.openRejectLoadDialog(index);
  }

  private openCancelLoadDialog(index: number, workOpportunity: any) {
    this.dialogService.showDialog(this.dialogContainer, NotificationDialogComponent, this.computeCancelLoadDialogInputs());

     this.dialogService.closeEventEmitter().subscribe(() => {
      this.dialogService.hideDialog([
        this.closeDialogEmitterSubscription,
        this.trueAnswearDialogEmitterSubscription
      ]);
    });

    this.dialogService.trueEventEmitter().subscribe(() => {
      this.dialogService.hideDialog([
        this.closeDialogEmitterSubscription,
        this.trueAnswearDialogEmitterSubscription
      ]);
      
      this.dashboardService.cancelLoad(this.loads[index]._id, workOpportunity).pipe(takeUntil(this.componentDestroyed$)).subscribe(() => {
        setTimeout(() => {
          if (workOpportunity.booked.isBooked) {
            this.dashboardService.createNotification(this.computeLoadCancelledNotificationPayload(workOpportunity))
              .pipe(takeUntil(this.componentDestroyed$))
              .subscribe();
          }
          this.openSucessfullyCancelledDialog();
        }, 500);
      });
    });
  }

  public onAddLoad() {
    this.dialogService.showDialog(this.dialogContainer, NewLoadDialogComponent, [ { name: 'companyProfile', value: this.companyProfile } ]);

    this.dialogService.closeEventEmitter().subscribe(() => {
      this.dialogService.hideDialog([
        this.closeDialogEmitterSubscription
      ]);
    });

    this.dialogService.successEventEmitter().subscribe(() => {
      this.dialogService.hideDialog([
        this.closeDialogEmitterSubscription
      ]);
      
      this.openSuccessfullyCreatedLoadDialog();
    }); 
  }

  private openRejectLoadDialog(index: number) {
    this.dialogService.showDialog(this.dialogContainer, NotificationDialogComponent, this.computeRejectLoadDialogInputs());

     this.dialogService.closeEventEmitter().subscribe(() => {
      this.dialogService.hideDialog([
        this.closeDialogEmitterSubscription,
        this.trueAnswearDialogEmitterSubscription
      ]);
    });

    this.dialogService.trueEventEmitter().subscribe(() => {
      this.dialogService.hideDialog([
        this.closeDialogEmitterSubscription,
        this.trueAnswearDialogEmitterSubscription
      ]);

      this.dashboardService.rejectLoad(this.loads[index]._id).pipe(takeUntil(this.componentDestroyed$)).subscribe(() => {
        setTimeout(() => {
          this.openSucessfullyRejectedDialog();
        }, 500);
      });
    });
  }

  private openSucessfullyRejectedDialog() {
    this.dialogService.showDialog(this.dialogContainer, NotificationDialogComponent, this.computeSuccessfulyRejectedDialogInputs());

     this.dialogService.closeEventEmitter().subscribe(() => {
      this.dialogService.hideDialog([
        this.closeDialogEmitterSubscription,
        this.trueAnswearDialogEmitterSubscription
      ]);

      this.getCarrierBookedLoads();
    });

    this.dialogService.trueEventEmitter().subscribe(() => {
      this.dialogService.hideDialog([
        this.closeDialogEmitterSubscription,
        this.trueAnswearDialogEmitterSubscription
      ]);

      this.getCarrierBookedLoads();
    });
  }

  private openSucessfullyCancelledDialog() {
    this.dialogService.showDialog(this.dialogContainer, NotificationDialogComponent, this.computeSuccessfulyCancelledDialogInputs());

     this.dialogService.closeEventEmitter().subscribe(() => {
      this.dialogService.hideDialog([
        this.closeDialogEmitterSubscription,
        this.trueAnswearDialogEmitterSubscription
      ]);

      this.getShipperCreatedLoads();
    });

    this.dialogService.trueEventEmitter().subscribe(() => {
      this.dialogService.hideDialog([
        this.closeDialogEmitterSubscription,
        this.trueAnswearDialogEmitterSubscription
      ]);

      this.getShipperCreatedLoads();
    });
  }

  private openSuccessfullyCreatedLoadDialog() {
    this.dialogService.showDialog(this.dialogContainer, NotificationDialogComponent, this.computeSuccessfullyCreatedLoadDialogInputs());

     this.dialogService.closeEventEmitter().subscribe(() => {
      this.dialogService.hideDialog([
        this.closeDialogEmitterSubscription,
        this.trueAnswearDialogEmitterSubscription
      ]);

      this.getShipperCreatedLoads();
    });

    this.dialogService.trueEventEmitter().subscribe(() => {
      this.dialogService.hideDialog([
        this.closeDialogEmitterSubscription,
        this.trueAnswearDialogEmitterSubscription
      ]);

      this.getShipperCreatedLoads();
    });
  }

  private computeCancelLoadDialogInputs() {
    return [
      {
        name: 'headerText',
        value: 'Are you sure you want to cancel this load?'
      },
      {
        name: 'leftButtonText',
        value: 'No'
      },
      {
        name: 'rightButtonText',
        value: 'Yes'
      },
      {
        name: 'displayCancel',
        value: true
      },
      {
        name: 'displayAfirmative',
        value: true
      },
    ];
  }

  private computeRejectLoadDialogInputs() {
    return [
      {
        name: 'headerText',
        value: 'Are you sure you want to reject this load?'
      },
      {
        name: 'leftButtonText',
        value: 'No'
      },
      {
        name: 'rightButtonText',
        value: 'Yes'
      },
      {
        name: 'displayCancel',
        value: true
      },
      {
        name: 'displayAfirmative',
        value: true
      },
    ];
  }

  private computeSuccessfulyRejectedDialogInputs() {
    return [
      {
        name: 'headerText',
        value: 'Load Rejected!'
      },
      {
        name: 'rightButtonText',
        value: 'Ok'
      },
      {
        name: 'displayCancel',
        value: false
      },
      {
        name: 'displayAfirmative',
        value: true
      },
    ];
  }

  private computeSuccessfulyCancelledDialogInputs() {
    return [
      {
        name: 'headerText',
        value: 'Load Cancelled!'
      },
      {
        name: 'rightButtonText',
        value: 'Ok'
      },
      {
        name: 'displayCancel',
        value: false
      },
      {
        name: 'displayAfirmative',
        value: true
      },
    ];
  }

  private computeSuccessfullyCreatedLoadDialogInputs() {
    return [
      {
        name: 'headerText',
        value: 'Load successfully created!'
      },
      {
        name: 'rightButtonText',
        value: 'Ok'
      },
      {
        name: 'displayCancel',
        value: false
      },
      {
        name: 'displayAfirmative',
        value: true
      },
    ];
  }

  private computeLoadCancelledNotificationPayload(workOpportunity: any): Notification {
    return {
      read: false,
      for: {
        userId: workOpportunity.booked.carrierId,
        companyLegalName: workOpportunity.booked.companyLegalName,
        companyEmailAddress: workOpportunity.booked.carrierEmailAddress,
        companyPhoneNumber: workOpportunity.booked.carrierPhoneNumber
      },
      from: {
        userId: workOpportunity.shipperDetails.shipperId,
        companyLegalName: workOpportunity.shipperDetails.shipperName,
        companyEmailAddress: workOpportunity.shipperDetails.shipperEmailAddress,
        companyPhoneNumber: workOpportunity.shipperDetails.shipperPhoneNumber
      },
      messageSummary: "Load cancelled " + workOpportunity.origin.city + " - " + workOpportunity.destination.city,
      message: this.computeLoadCancelledNotificationMessage(workOpportunity)
    }
  }

  private computeLoadCancelledNotificationMessage(workOpportunity: any) {
    return "Load " + workOpportunity.origin.city + "(" +  workOpportunity.origin.arrival + ")" 
      + " - " + workOpportunity.destination.city + "(" +  workOpportunity.origin.arrival + ")" + " has been cancelled.";
  }

}
