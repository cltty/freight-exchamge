import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { CompanyProfile } from 'src/app/auth/create-profile/models/CompanyProfile';
import { LogoutDialogComponent } from 'src/app/common/dialogs/logout-dialog/logout-dialog.component';
import { UserService } from 'src/app/user-service/user.service';
import { DashboardService } from '../service/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
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

  private componentDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    private userService: UserService,
    private dashboardService: DashboardService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router
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
    const dialogRef = this.dialog.open(LogoutDialogComponent);

    dialogRef.afterClosed().pipe(takeUntil(this.componentDestroyed$)).subscribe(result => {
      if (result) {
        this.authService.logoutUser().pipe(takeUntil(this.componentDestroyed$)).subscribe(() => {
          this.router.navigateByUrl(`/login`);
        });
      }
    });
  }
  
  public ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

}