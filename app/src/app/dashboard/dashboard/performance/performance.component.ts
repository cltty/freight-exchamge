import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CompanyProfile } from 'src/app/auth/create-profile/models/CompanyProfile';
import { UserService } from 'src/app/user-service/user.service';
import { DashboardService } from '../../service/dashboard.service';

@Component({
  selector: 'fx-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.scss']
})
export class PerformanceComponent implements OnInit, OnDestroy {
  @Input()
  public companyProfile: CompanyProfile;
  public performance;

  public loads;
  public reports;

  public loadsForSelectedTimePeriod;
  public reportsForSelectedTimePeriod;

  public today: Date = new Date();
  public sixWeeksAgo: Date;

  public timePeriod = [
    'past 6 weeks',
    'all time'
  ];

  public selectedRadio = 'sixWeeks';

  public defaultPeriod = 'sixWeeks';

  public date = new Date();

  private componentDestroyed$: Subject<void> = new Subject<void>();

  constructor(private userService: UserService, private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.computeSixWeeksAgoDate();
    forkJoin([
      this.companyProfile.companyDetails.companyType === 'Carrier' ? 
        this.dashboardService.getLoadsByCarrierId(this.userService.getUserId()) : 
        this.dashboardService.getLoadsByShipperId(this.userService.getUserId()), 
      this.dashboardService.getReportsByUserId(this.userService.getUserId())
    ]).pipe(takeUntil(this.componentDestroyed$)).subscribe(([loads, reports]: any) => {
      this.loads = loads;
      this.reports = reports;
      this.onSixWeeksTimePeriod();
      this.computePerformanceForPastSixWeeks();
    });
  }

  private computeSixWeeksAgoDate() {
    let x: Date = this.today;
    x.setDate(x.getDate() - 42);
    this.sixWeeksAgo = x;    
  }

  private computePerformanceForPastSixWeeks() {
    let loadsNotOlderThanSixWeeks = 0;

    this.loads.forEach(load => {
      if (new Date(load.createdAt) > this.sixWeeksAgo) {
        loadsNotOlderThanSixWeeks++;
      }
    });

    let reportsNotOlderThanSixWeeks = 0;

    this.reports.forEach(report => {
      if (new Date(report.createdAt) > this.sixWeeksAgo) {
        reportsNotOlderThanSixWeeks++;
      }
    });

    this.performance = (loadsNotOlderThanSixWeeks + 0.8 * reportsNotOlderThanSixWeeks) / (loadsNotOlderThanSixWeeks + reportsNotOlderThanSixWeeks) * 100; 
  }

  public onSixWeeksTimePeriod() {
    this.defaultPeriod = 'sixWeeks';
    this.changeLoadsPeriod('sixWeeks');
    this.changeReportsPeriod('sixWeeks');
  }

  public onAllTimeTimePeriod() {
    this.defaultPeriod = 'allTime';
    this.changeLoadsPeriod('allTime');
    this.changeReportsPeriod('allTime');
  }

  private changeLoadsPeriod(period: string) {
    console.log("changeLoadsPeriod > ", period);
    switch(period) {
      case 'sixWeeks': {
        let tmpArray = [];
        this.loads.forEach(load => {
          if (new Date(load.createdAt) > this.sixWeeksAgo) {
            tmpArray.push(load);
          }
        });
        this.loadsForSelectedTimePeriod = tmpArray;
        break;
      }
      case 'allTime': {
        this.loadsForSelectedTimePeriod = this.loads;
        break;
      }
      default:
        break;
    }
  }

  private changeReportsPeriod(period: string) {
    switch(period) {
      case 'sixWeeks': {
        let tmpArray = [];
        this.reports.forEach(report => {
          if (new Date(report.createdAt) > this.sixWeeksAgo) {
            tmpArray.push(report);
          }
        });
        this.reportsForSelectedTimePeriod = tmpArray;
        break;
      }
      case 'allTime': {
        this.reportsForSelectedTimePeriod = this.reports;
        break;
      }
      default:
        break;
    }
  }

  public radioChange(event: any) {
    if (event.value === 'sixWeeks') {
      this.changeLoadsPeriod(event.value);
      this.changeReportsPeriod(event.value);
    } else {
      this.changeLoadsPeriod(event.value);
      this.changeReportsPeriod(event.value);
    }
  }

  public ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
