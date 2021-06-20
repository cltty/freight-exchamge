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
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
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
import { CommonDialogComponent } from './common/dialogs/common-dialog/common-dialog.component';
import { NotificationDialogComponent } from './common/dialogs/notification-dialog/notification-dialog.component';
import { NewLoadDialogComponent } from './common/dialogs/new-load-dialog/new-load-dialog.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { AddressDialogComponent } from './common/dialogs/address-dialog/address-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    CommonDialogComponent,
    NotificationDialogComponent,
    NewLoadDialogComponent,
    AddressDialogComponent
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
    MatDialogModule,
    GooglePlaceModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule
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
    },
    MatNativeDateModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
