import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CompanyProfile } from 'src/app/auth/create-profile/models/CompanyProfile';
import { UserService } from 'src/app/user-service/user.service';
import { Load } from '../../models/load';
import { DashboardService } from '../../service/dashboard.service';
// import { cities } from "cities.json";

@Component({
  selector: 'fx-loadboard',
  templateUrl: './loadboard.component.html',
  styleUrls: ['./loadboard.component.scss']
})
export class LoadboardComponent implements OnInit {
  @Input()
  public companyProfile: CompanyProfile;

  public searchCriteriaForm: FormGroup;

  public companyTypes: string[] = [
    "Shipper",
    "Carrier"
  ];

  // public dummyCities: any =  [
  //   {
  //     name: 'Iasi',
  //     country: 'Ro',
  //     lat: '45.0346',
  //     lon: '53.0346'
  //   },
  //   {
  //     name: 'Roman',
  //     country: 'Ro',
  //     lat: '45.0346',
  //     lon: '53.0346'
  //   },
  //   {
  //     name: 'Bacau',
  //     country: 'Ro',
  //     lat: '45.0346',
  //     lon: '53.0346'
  //   },
  // ];

  // public dummyWorkOpportunity: any = {
  //   origin: "OSS",
  //   originArrival: "Tue 1 Jun 17:00",
  //   destination: "FRANKHENTAL",
  //   destinationArrival: "Wed 2 Jun 23:30",
  //   distance: "1.200km",
  //   price: "1500$"
  // };

  public companyType: string;
  public availableLoads: Load[] = [];

  private componentDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder, 
    private dashboardService: DashboardService,
    private userService: UserService) {
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
    // getAllAvailableLoads
    this.dashboardService.getAllAvailableLoads().pipe(takeUntil(this.componentDestroyed$)).subscribe(loads => {
      this.availableLoads = loads;
      this.shortenArrivalDates();
    });
    // this.dashboardService.getLoadsByBookedFlag(false).pipe(takeUntil(this.componentDestroyed$)).subscribe(loads => {
    //   console.log("Loads => ", loads);
    //   this.availableLoads = loads;
    //   this.shortenArrivalDates();
    //   console.log("availableLoads -> ", this.availableLoads);
    // });
  }

  private shortenArrivalDates() {
    this.availableLoads.forEach(load => {
      load.origin.arrival = "02/06/2021";
      load.destination.arrival = "03/06/2021"
    })
  }

  displayFn(city): string {
    return city && city.name ? city.name : '';
  }

  get companyLegalName() {
    return this.searchCriteriaForm.get('origin');
  }

  public inputChangeSearchCriteriaForm($event: any, city: any) {
    console.log('inputChangeSearchCriteriaForm');
  }

  public bookLoad(index: number) {
    const bookPayload = {
      carrierId: this.userService.getUserId(),
      carrierCompanyLegalName: this.companyProfile.companyDetails.companyLegalName,
      carrierEmailAddress: this.companyProfile.emailAddress,
      carrierPhoneNumber: this.companyProfile.companyDetails.phoneNumber
    }
    this.dashboardService
      .bookLoad(this.availableLoads[index]._id, bookPayload)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(response => {
        console.log("Book load response => ", response);
        setTimeout(() => {
          alert("Successfully booked!");
          this.getAllUnbookedLoads();
        }, 1000);
      },
      err => {
        console.log("Book err -> ", err);
        alert("Error: Load already booked!");
      }
      );
    
  }
}
