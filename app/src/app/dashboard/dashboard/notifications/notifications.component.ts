import { Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CompanyProfile } from 'src/app/auth/create-profile/models/CompanyProfile';
import { NotificationDialogComponent } from 'src/app/common/dialogs/notification-dialog/notification-dialog.component';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { UserService } from 'src/app/user-service/user.service';
import { DashboardService } from '../../service/dashboard.service';

@Component({
  selector: 'fx-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  @ViewChild('dialog', { read: ViewContainerRef })
  public dialogContainer: ViewContainerRef;
  
  @Input()
  public companyProfile: CompanyProfile;
  
  public unreadNotifications: any[];

  public companyType: string;

  private closeDialogEmitterSubscription: Subscription;
  private trueAnswearDialogEmitterSubscription: Subscription;

  private componentDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    private userService: UserService,
    private dashboardService: DashboardService,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.getUnreadNotifications();
    this.getCompanyType();
  }

  private getUnreadNotifications() {
    this.dashboardService.getUnreadNotifications(this.userService.getUserId())
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(unreadNotifications => {
        this.unreadNotifications = unreadNotifications;
      });
  }

  private getCompanyType() {
    this.companyType = this.userService.getCompanyType();
  }

  public reportShipper(index: number, companyName: string) {
    this.openReportShipperDialog(index, companyName);
  }

  public reportCarrier(index: number, companyName: string) {
    this.openReportCarrierDialog(index, companyName);
  }

  public markAsRead(index: number) {
    this.openMarkAsReadDialog(index);
  }

  private openReportShipperDialog(index: number, companyName: string) {
    this.dialogService.showDialog(this.dialogContainer, NotificationDialogComponent, this.computeReportUserDialogInputs(companyName));

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
      
      this.dashboardService.reportUser(this.computeReportShipperPayload(index)).subscribe();
    });
  }

  private openReportCarrierDialog(index: number, companyName: string) {
    this.dialogService.showDialog(this.dialogContainer, NotificationDialogComponent, this.computeReportUserDialogInputs(companyName));

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
      
      this.dashboardService.reportUser(this.computeReportCarrierPayload(index)).subscribe();
    });
  }

  private openMarkAsReadDialog(index: number) {
    this.dialogService.showDialog(this.dialogContainer, NotificationDialogComponent, this.computeMarkAsReadDialogInputs());

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
      
      this.dashboardService.markAsRead(this.unreadNotifications[index]._id).subscribe(() => {
        this.getUnreadNotifications();
      }); 
    });
  }

  private computeReportUserDialogInputs(companyName: string) {
    return [
      {
        name: 'headerText',
        value: 'Are you sure you want to report ' + companyName + '?'
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

  private computeMarkAsReadDialogInputs() {
    return [
      {
        name: 'headerText',
        value: 'Mark as read?'
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

  private computeReportShipperPayload(index: number) {
    return {
      reason: "Cancelling load",
      userId: this.userService.getUserId(),
      reportedBy: {
        userId: this.unreadNotifications[index].from.userId,
        companyLegalName: this.unreadNotifications[index].from.companyLegalName,
        companyEmailAddress: this.unreadNotifications[index].from.companyEmailAddress,
        companyPhoneNumber: this.unreadNotifications[index].from.companyPhoneNumber
      }
    }
  }

  private computeReportCarrierPayload(index: number) {
    return {
      reason: "Rejecting load..",
      userId: this.userService.getUserId(),
      reportedBy: {
        userId: this.unreadNotifications[index].from.userId,
        companyLegalName: this.unreadNotifications[index].from.companyLegalName,
        companyEmailAddress: this.unreadNotifications[index].from.companyEmailAddress,
        companyPhoneNumber: this.unreadNotifications[index].from.companyPhoneNumber
      }
    }
  }

  public ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
