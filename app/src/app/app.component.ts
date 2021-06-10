import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from './user-service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy{
  public showDefaultBreadcrumb: boolean = true;
  public showLoadboardNavBar: boolean;

  private componentDestroyed$: Subject<void> = new Subject<void>();

  constructor(private userService: UserService) {}

  public ngOnInit() {
    this.userService.toggleDefaultNavbar$.pipe(takeUntil(this.componentDestroyed$)).subscribe(flag => {
      this.showDefaultBreadcrumb = flag;
    });
  }

  public ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
