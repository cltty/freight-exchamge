import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CompanyProfile } from 'src/app/auth/create-profile/models/CompanyProfile';
import { MarkAsReadDialogComponent } from 'src/app/common/dialogs/mark-as-read-dialog/mark-as-read-dialog.component';
import { ReportShipperComponent } from 'src/app/common/dialogs/report-shipper/report-shipper.component';
import { UserService } from 'src/app/user-service/user.service';
import { DashboardService } from '../../service/dashboard.service';

@Component({
  selector: 'fx-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  @Input()
  public companyProfile: CompanyProfile;
  
  public unreadNotifications: any[];

  public companyType: string;

  private componentDestroyed$: Subject<void> = new Subject<void>();

  constructor(private userService: UserService, private dashboardService: DashboardService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getUnreadNotifications();
    this.getCompanyType();
  }

  private getUnreadNotifications() {
    this.dashboardService.getUnreadNotifications(this.userService.getUserId())
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(unreadNotifications => {
        this.unreadNotifications = unreadNotifications;
        console.log("unreadNotifications >> ", unreadNotifications);
      });
  }

  private getCompanyType() {
    this.companyType = this.userService.getCompanyType();
  }

  public reportShipper(index: number) {
    console.log("reportShipper");
    const dialogRef = this.dialog.open(ReportShipperComponent);

    dialogRef.afterClosed().pipe(takeUntil(this.componentDestroyed$)).subscribe(result => {
      if (result) {
        console.log("Reporting shipper...");
        this.dashboardService.reportUser(this.computeReportShipperPayload(index)).subscribe(response => {
          console.log("reportUser >> ", response);
        });
      }
    });
  }

  public reportCarrier(index: number) {
    console.log("reportCarrier");
    const dialogRef = this.dialog.open(ReportShipperComponent);

    dialogRef.afterClosed().pipe(takeUntil(this.componentDestroyed$)).subscribe(result => {
      if (result) {
        console.log("Reporting carrier...");
        this.dashboardService.reportUser(this.computeReportCarrierPayload(index)).subscribe(response => {
          console.log("reportUser >> ", response);
        });
      }
    });
  }

  public markAsRead(index: number) {
    const dialogRef = this.dialog.open(MarkAsReadDialogComponent);

    dialogRef.afterClosed().pipe(takeUntil(this.componentDestroyed$)).subscribe(result => {
      if (result) {
        this.dashboardService.markAsRead(this.unreadNotifications[index]._id).subscribe(() => {
          this.getUnreadNotifications();
        }); 
      }
    });
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

  private computeMarkAsReadPayload() {
    return "paylaod";
  }

  public shorten(x: any) {
    return "22/05/2021";
  } 

  public ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
