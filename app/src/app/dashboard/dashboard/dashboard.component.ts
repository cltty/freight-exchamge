import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { CompanyProfile } from 'src/app/auth/create-profile/models/CompanyProfile';
import { NotificationDialogComponent } from 'src/app/common/dialogs/notification-dialog/notification-dialog.component';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { UserService } from 'src/app/user-service/user.service';
import { DashboardService } from '../service/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('dialog', { read: ViewContainerRef })
  public dialogContainer: ViewContainerRef;

  public sideNavbarOptions = [
    {
      optionName: "Notifications",
      optionValue: 0
    },
    {
      optionName: "Trips",
      optionValue: 1
    },
    {
      optionName: "Loadboard",
      optionValue: 2
    },
    {
      optionName: "Performance",
      optionValue: 3
    },
    {
      optionName: "Company Account",
      optionValue: 4
    },
  ]

  public currentActiveSection: number = 2;
  public companyProfile: CompanyProfile;

  private closeDialogEmitterSubscription: Subscription;
  private trueAnswearDialogEmitterSubscription: Subscription;


  private componentDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    private userService: UserService,
    private dashboardService: DashboardService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private dialogService: DialogService
  ) {
    this.userService.toggleDefaultNavbar$.next(false);
  }

  public ngOnInit(): void {
    this.dashboardService
      .getCompanyByUserId(this.userService.getUserId())
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(response => {
      this.companyProfile = response;
    });
  }

  public onSideNavbarOptionClick(sideNavbarOption: any) {
    this.currentActiveSection = sideNavbarOption;
  }

  public onLogout() {
    this.dialogService.showDialog(this.dialogContainer, NotificationDialogComponent, this.computeLogoutDialogInputs());

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
      
      this.authService.logoutUser().pipe(takeUntil(this.componentDestroyed$)).subscribe(() => {
        this.userService.resetLocalStorage();
        this.router.navigateByUrl(`/login`);
      });      
      
    });
  }
  
  private computeLogoutDialogInputs() {
    return [
      {
        name: 'headerText',
        value: 'Are you sure you want to logout?'
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
  
  public ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

}