import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CompanyProfile } from 'src/app/auth/create-profile/models/CompanyProfile';
import { CancelLoadDialogComponent } from 'src/app/common/dialogs/cancel-load-dialog/cancel-load-dialog.component';
import { LoadCancelledDialogComponent } from 'src/app/common/dialogs/load-cancelled-dialog/load-cancelled-dialog.component';
import { LoadRejectedDialogComponent } from 'src/app/common/dialogs/load-rejected-dialog/load-rejected-dialog.component';
import { RejectLoadDialogComponent } from 'src/app/common/dialogs/reject-load-dialog/reject-load-dialog.component';
import { UserService } from 'src/app/user-service/user.service';
import { CreateLoadDialogComponent } from '../../create-load-dialog/create-load-dialog.component';
import { Load } from '../../models/load';
import { DashboardService } from '../../service/dashboard.service';

@Component({
  selector: 'fx-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.scss']
})
export class TripsComponent implements OnInit {
  @Input()
  public companyProfile: CompanyProfile;

  public companyType: string;
  public loads: Load[] = [];

  private componentDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    private userService: UserService,
    private dashboardService: DashboardService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getCompanyType();

    this.dashboardService.createNewLoad$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(newLoadPayLoad => {
        this.createNewLoad(newLoadPayLoad);
      });
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
        this.shortenArrivalDates();
      });
  }

  private getCarrierBookedLoads() {
    this.dashboardService.getLoadsByCarrierId(this.userService.getUserId())
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(loads => {
        this.loads = loads;
        this.shortenArrivalDates();
      });
  }

  // use DatePipe
  private shortenArrivalDates() {
    this.loads.forEach(load => {
      load.origin.arrival = "02/06/2021";
      load.destination.arrival = "03/06/2021"
    })
  }

  private getCompanyType() {
    this.companyType = this.userService.getCompanyType();
    this.getLoads();
  }

  public onAddLoad() {
    const dialogRef = this.dialog.open(CreateLoadDialogComponent);

    dialogRef.afterClosed().pipe(takeUntil(this.componentDestroyed$)).subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  public computeNewLoadPayload(newLoad: any) {
    return {
      shipperDetails: {
        shipperId: this.companyProfile.userId,
        shipperName: this.companyProfile.companyDetails.companyLegalName,
        shipperPhoneNumber: this.companyProfile.companyDetails.phoneNumber,
        shipperEmailAddress: this.companyProfile.emailAddress
      },
      booked: {
        isBooked: false,
        carrierId: null,
      },
      origin: {
        city: newLoad.originCity,
        country: newLoad.originCountry,
        zipcode: newLoad.originZipcode,
        arrival: newLoad.originArrival
      },
      destination: {
        city: newLoad.destinationCity,
        country: newLoad.destinationCountry,
        zipcode: newLoad.destinationZipcode,
        arrival: newLoad.destinationArrival
      },
      distance: newLoad.distance,
      payout: newLoad.payout,
      equipment: {
        equipment: newLoad.equipment,
        isRequired: newLoad.isEquipmentRequired
      }
    }
  }


  public createNewLoad(newLoadPayLoad) {
    this.dashboardService.createNewLoad(this.computeNewLoadPayload(newLoadPayLoad)).subscribe(response => {
      setTimeout(() => {
        this.getShipperCreatedLoads();
      }, 1000);
    });
  }

  public cancelLoad(index: number) {
    const dialogRef = this.dialog.open(CancelLoadDialogComponent);

    dialogRef.afterClosed().pipe(takeUntil(this.componentDestroyed$)).subscribe(result => {
      if (result) {
        this.dashboardService.cancelLoad(this.loads[index]._id).pipe(takeUntil(this.componentDestroyed$)).subscribe(() => {
          setTimeout(() => {
            const loadCancelledDialogRef = this.dialog.open(LoadCancelledDialogComponent);
            loadCancelledDialogRef.afterClosed().pipe(takeUntil(this.componentDestroyed$)).subscribe(() => {
              this.getShipperCreatedLoads();
            });
          }, 700);
        });
      }
    });
  }

  public rejectLoad(index: number) {
    const dialogRef = this.dialog.open(RejectLoadDialogComponent);
    dialogRef.afterClosed().pipe(takeUntil(this.componentDestroyed$)).subscribe(result => {
      if (result) {
        this.dashboardService.rejectLoad(this.loads[index]._id).pipe(takeUntil(this.componentDestroyed$)).subscribe(() => {
          setTimeout(() => {
            const loadRejectedDialogRef = this.dialog.open(LoadRejectedDialogComponent);
            loadRejectedDialogRef.afterClosed().pipe(takeUntil(this.componentDestroyed$)).subscribe(() => {
              this.getCarrierBookedLoads();
            });
          }, 700);
        });
      }
    });
  }

}
