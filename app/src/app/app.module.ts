import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { BreadcrumbComponent } from './layout/breadcrumb/breadcrumb.component';
import { RegisterComponent } from './auth/register/register.component';
import { GetStartedComponent } from './auth/get-started/get-started.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatTabsModule } from '@angular/material/tabs';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { CreateProfileComponent } from './auth/create-profile/create-profile.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatIconModule } from '@angular/material/icon';
import { DeleteUploadedFileDialogComponent } from './common/delete-uploaded-file-dialog/delete-uploaded-file-dialog.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { JwtIncerceptor } from './auth-helpers/jwt-interceptor';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { LoadboardComponent } from './dashboard/dashboard/loadboard/loadboard.component';
import { TripsComponent } from './dashboard/dashboard/trips/trips.component';
import { NotificationsComponent } from './dashboard/dashboard/notifications/notifications.component';
import { CompanyAccountComponent } from './dashboard/dashboard/company-account/company-account.component';
import { PerformanceComponent } from './dashboard/dashboard/performance/performance.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { CreateLoadDialogComponent } from './dashboard/create-load-dialog/create-load-dialog.component';
import { CancelLoadDialogComponent } from './common/dialogs/cancel-load-dialog/cancel-load-dialog.component';
import { RejectLoadDialogComponent } from './common/dialogs/reject-load-dialog/reject-load-dialog.component';
import { LoadCancelledDialogComponent } from './common/dialogs/load-cancelled-dialog/load-cancelled-dialog.component';
import { LoadRejectedDialogComponent } from './common/dialogs/load-rejected-dialog/load-rejected-dialog.component';
import { ReportShipperComponent } from './common/dialogs/report-shipper/report-shipper.component';
import { MarkAsReadDialogComponent } from './common/dialogs/mark-as-read-dialog/mark-as-read-dialog.component';
import { ReportCarrierComponent } from './common/dialogs/report-carrier/report-carrier.component';
import { LogoutDialogComponent } from './common/dialogs/logout-dialog/logout-dialog.component';
import { LoadBookedDialogComponent } from './common/dialogs/load-booked-dialog/load-booked-dialog.component';
import { LoadBookFailedDialogComponent } from './common/dialogs/load-book-failed-dialog/load-book-failed-dialog.component';
import { RegisterSucessfulDialogComponent } from './common/dialogs/register-sucessful-dialog/register-sucessful-dialog.component';
import { CommonDialogComponent } from './common/dialogs/common-dialog/common-dialog.component';
import { NotificationDialogComponent } from './common/dialogs/notification-dialog/notification-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BreadcrumbComponent,
    RegisterComponent,
    GetStartedComponent,
    CreateProfileComponent,
    DeleteUploadedFileDialogComponent,
    DashboardComponent,
    LoadboardComponent,
    TripsComponent,
    NotificationsComponent,
    CompanyAccountComponent,
    PerformanceComponent,
    CreateLoadDialogComponent,
    CancelLoadDialogComponent,
    RejectLoadDialogComponent,
    LoadCancelledDialogComponent,
    LoadRejectedDialogComponent,
    ReportShipperComponent,
    MarkAsReadDialogComponent,
    ReportCarrierComponent,
    LogoutDialogComponent,
    LoadBookedDialogComponent,
    LoadBookFailedDialogComponent,
    RegisterSucessfulDialogComponent,
    CommonDialogComponent,
    NotificationDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserModule, 
    FormsModule, 
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTabsModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatStepperModule,
    MatRadioModule,
    MatListModule,
    MatSelectModule,
    PdfViewerModule,
    MatIconModule,
    NgxCaptchaModule,
    MatSidenavModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatCardModule,
    MatDialogModule
  ],
  providers: [
    HttpClientModule,
    {
      provide: HTTP_INTERCEPTORS,
      // useClass: JwtIncerceptor,
      useFactory: function(router: Router, authService: AuthService) {
        return new JwtIncerceptor(router, authService);
      },
      multi: true,
      deps: [Router, AuthService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
