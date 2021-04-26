import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BreadcrumbComponent,
    RegisterComponent,
    GetStartedComponent,
    CreateProfileComponent
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
    MatSelectModule
  ],
  providers: [HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
