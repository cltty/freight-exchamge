import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { countries } from './models/countries_array/contries_array';
import { Country } from './models/contry';
import { FileUploadType } from './models/FileUploadType';
import { CustomValidators } from 'src/app/common/validators/custom-validator';
import { AuthService } from '../auth.service';
import { CompanyProfile } from './models/CompanyProfile';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatStepper } from '@angular/material/stepper';
import { ValidatorService } from 'angular-iban';
import { UserService } from 'src/app/user-service/user.service';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { AddressDialogComponent } from 'src/app/common/dialogs/address-dialog/address-dialog.component';
import { Router } from '@angular/router';
import { NotificationDialogComponent } from 'src/app/common/dialogs/notification-dialog/notification-dialog.component';

@Component({
  selector: 'create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class CreateProfileComponent implements OnInit {
  @ViewChild('dialog', { read: ViewContainerRef })
  public dialogContainer: ViewContainerRef;

  @ViewChild("stepper", { static: false }) stepper: MatStepper;


  public companyTypes: string[] = [
    "Shipper",
    "Carrier"
  ];

  @ViewChild('dummyFileInput', { static: false }) dummyFileInput: ElementRef;

  public contriesList: Country[] = countries;
  public imgsArray: any[] = [];
  public imgUrlsArray: any[] = [];
  public pdfSrc: any;

  public insuranceDocuments: any = [];
  public operatingLicense: FileUploadType[] = [];
  public operatingLicenseCount: number = 0;

  public companyDetailsForm: FormGroup;
  public equipmentInvetoryForm: FormGroup;
  public insuranceForm: FormGroup;
  public paymentDetailsForm: FormGroup;

  public displayInvalidVatNumberError: boolean = false;
  public invalidVatNumberError: string;

  private componentDestroyed$: Subject<void> = new Subject<void>();

  private closeAddressDialogEmitterSubscription: Subscription;
  private addressSelectedEmitterSubscription: Subscription;

  public displayInsuranceDocumentsStepper = false;

  private closeDialogEmitterSubscription: Subscription;
  private trueAnswearDialogEmitterSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private dialogService: DialogService,
    private router: Router
    ) {
    this.companyDetailsForm = this.formBuilder.group({
      companyLegalName: ['', [ Validators.required, CustomValidators.forbiddenCharacters() ]],
      companyType: ['', [ Validators.required, CustomValidators.forbiddenCharacters() ]],
      city: ['', [ Validators.required, CustomValidators.forbiddenCharacters() ]],
      fullAddress: [''],
      phoneNumber: ['', [ Validators.required, CustomValidators.forbiddenCharacters(), CustomValidators.phoneNumberValidator() ]],
      country: ['', [ Validators.required ]],
      vatNumber: ['', [ Validators.required, CustomValidators.forbiddenCharacters(), CustomValidators.onlyDigits()]]
    });

    this.equipmentInvetoryForm = this.formBuilder.group({
      standardTractorUnits: ['', [ CustomValidators.forbiddenCharacters() ]],
      sevenHalfTrucks: ['', [ CustomValidators.forbiddenCharacters() ]],
      threeHalfTailiftVans: ['', [ CustomValidators.forbiddenCharacters() ]],
      threeHalfVans: ['', [ CustomValidators.forbiddenCharacters() ]],
      boxTrailers: ['', [ CustomValidators.forbiddenCharacters() ]],
      curtainSidedTrailers: ['', [ CustomValidators.forbiddenCharacters() ]]
    });

    this.paymentDetailsForm = this.formBuilder.group({
      accountHolderName: ['', [ Validators.required, CustomValidators.forbiddenCharacters() ]],
      swiftBicCode: ['', [ Validators.required, CustomValidators.forbiddenCharacters() ]],
      ibanNumber: ['', [ Validators.required, CustomValidators.forbiddenCharacters(), ValidatorService.validateIban]]
    });
  }

  ngOnInit(): void {}

  get fullAddress() {
    return this.companyDetailsForm.get('fullAddress');
  }

  get companyLegalName() {
    return this.companyDetailsForm.get('companyLegalName');
  }

  get city() {
    return this.companyDetailsForm.get('city');
  }

  get companyType() {
    return this.companyDetailsForm.get('companyType');
  }

  get phoneNumber() {
    return this.companyDetailsForm.get('phoneNumber');
  }

  get country() {
    return this.companyDetailsForm.get('country');
  }

  get vatNumber() {
    return this.companyDetailsForm.get('vatNumber');
  }

  get standardTractorUnits() {
    return this.equipmentInvetoryForm.get('standardTractorUnits');
  }
  
  get sevenHalfTrucks() {
    return this.equipmentInvetoryForm.get('sevenHalfTrucks');
  }
  
  get threeHalfTailiftVans() {
    return this.equipmentInvetoryForm.get('threeHalfTailiftVans');
  }
  
  get threeHalfVans() {
    return this.equipmentInvetoryForm.get('threeHalfVans');
  }

  get boxTrailers() {
    return this.equipmentInvetoryForm.get('boxTrailers');
  }

  get curtainSidedTrailers() {
    return this.equipmentInvetoryForm.get('curtainSidedTrailers');
  }

  get accountHolderName() {
    return this.paymentDetailsForm.get('accountHolderName');
  }

  get swiftBicCode() {
    return this.paymentDetailsForm.get('swiftBicCode');
  }
  
  get ibanNumber() {
    return this.paymentDetailsForm.get('ibanNumber');
  }

  get confirmIbanNumber() {
    return this.paymentDetailsForm.get('confirmIbanNumber');
  }

  public inputChangeCompanyDetailsForm(event: any, inputField: string) {
    if (inputField === 'companyType') {
      this.companyDetailsForm.get(inputField).setValue(event.value);
      return;
    }
    this.companyDetailsForm.get(inputField).setValue(event.target.value);
    
    if (inputField === 'vatNumber') {
      this.checkVatNumber();
    }
  }

  public inputChangeEquipmentInvetoryForm(event: any, inputField: string) {
    this.equipmentInvetoryForm.get(inputField).setValue(event.target.value);
  }

  public inputChangePaymentDetailsForm(event: any, inputField: string) {
    this.paymentDetailsForm.get(inputField).setValue(event.target.value);
  }

  public onAddressSelect() {
    this.dialogService.showAddressDialog(this.dialogContainer, AddressDialogComponent, []);

    this.dialogService.closeAddressDialogEventEmitter().subscribe(() => {
      this.dialogService.hideAddressDialog([
        // needed?
        this.closeAddressDialogEmitterSubscription,
        this.addressSelectedEmitterSubscription
      ]);
    });

    this.dialogService.addressSelectedEventEmitter().subscribe(address => {
      this.dialogService.hideAddressDialog([
        this.closeAddressDialogEmitterSubscription,
        this.addressSelectedEmitterSubscription
      ]);

      this.setAddress(address.prettyfiedAddress);
    });
  }

  private setAddress(address: string) {
    this.city.setValue(address.split(', ')[0]);
    this.country.setValue(address.split(', ')[1]);
    this.fullAddress.setValue(address);
    this.checkVatNumber();
  }

  public onInsuranceFilesChanged($event) {
    const reader = new FileReader();
    reader.readAsDataURL($event.target.files[0]);
    reader.onload = (_event) => {
      this.insuranceDocuments.push({
        usedFor: 'insurance',
        type: $event.target.files[0].type === 'application/pdf' ? 'pdf' : 'img',
        name:  $event.target.files[0].name,
        file: reader.result
      });
    };
  }

  public onOperatingLicenseFileChanged($event) {
    const reader = new FileReader();

    reader.readAsDataURL($event.target.files[0]);
    reader.onload = (_event) => {
      this.operatingLicense.push({
        type: $event.target.files[0].type === 'application/pdf' ? 'pdf' : 'img',
        name:  $event.target.files[0].name,
        file: reader.result
      }); 
    };
  }

  public deleteUploadedFile(index: number) {
    this.insuranceDocuments.splice(index, 1);
  }

  public deleteOperatingLicenseFile(index: number) {
    this.operatingLicense.splice(index, 1);
  }

  public hasCompanyDetailsFormErrors() {
    return this.companyLegalName.errors ||
          this.companyType.errors || 
          this.city.errors ||
          this.phoneNumber.errors ||
          this.country.errors ||
          this.vatNumber.errors;
  }

  public hasEquipmentInvetoryFormErrors() {
    return this.standardTractorUnits.errors ||
          this.sevenHalfTrucks.errors || 
          this.threeHalfTailiftVans.errors ||
          this.threeHalfVans.errors ||
          this.boxTrailers.errors ||
          this.curtainSidedTrailers.errors;
  }

  public hasPaymentDetailsFormErrors() {
    return this.accountHolderName.errors ||
          this.swiftBicCode.errors || 
          this.ibanNumber.errors;
  }

  public haveInsuranceDocumentsErrors() {
    return this.companyType.value === 'Shipper' ? true : this.insuranceDocuments.length !== 2;
  }

  public haveOperatingLicenseErrors() {
    return this.companyType.value === 'Shipper' ? true : this.operatingLicense.length !== 1;
  }

  public isReadyForSubmit() {
    return !this.hasCompanyDetailsFormErrors() &&
      (this.companyType.value === 'Carrier' ? !this.hasEquipmentInvetoryFormErrors() : true) &&
      !this.hasPaymentDetailsFormErrors() &&
      (this.companyType.value === 'Carrier' ?  !this.haveInsuranceDocumentsErrors() : true) &&
      (this.companyType.value === 'Carrier' ? !this.haveOperatingLicenseErrors() : true);
  }

  public computePayload() {
    let profilePayload: CompanyProfile = {
      userId: this.userService.getUserId(),
      emailAddress: this.userService.getUserEmailAddress(),
      companyDetails: {
        companyLegalName: this.companyLegalName.value,
        companyType: this.companyType.value,
        vatNumber: this.vatNumber.value,
        city: this.city.value,
        country: this.country.value,
        phoneNumber: this.phoneNumber.value
      },
      paymentDetails: {
        accountHolderName: this.accountHolderName.value,
        swiftBicCode: this.swiftBicCode.value,
        ibanNumber: this.ibanNumber.value,
      }
    };

    if (this.companyType.value === 'Carrier') {
      profilePayload.equipment =  {
        standardTractorUnits: this.standardTractorUnits.value,
        sevenHalfTrucks: this.sevenHalfTrucks.value,
        threeHalfTailiftVans: this.threeHalfTailiftVans.value,
        threeHalfVans: this.threeHalfVans.value,
        curtainSidedTrailers: this.curtainSidedTrailers.value,
      };
      // profilePayload.insuranceDocuments = this.insuranceDocuments;
      // profilePayload.operatinLicense = this.operatingLicense;
    }

    return profilePayload;
  }

  public debug() {
    console.log('> debug()');
    console.log(this.paymentDetailsForm);
  }

  public submitProfile() {
    this.userService.createCompanyProfile(this.computePayload()).pipe(takeUntil(this.componentDestroyed$)).subscribe(response => {
      this.openSuccessDialog();
      this.userService.setCompanyType(this.companyType.value);
    });
  }
  
  private openSuccessDialog() {
    this.dialogService.showDialog(this.dialogContainer, NotificationDialogComponent, this.computeSuccessDialogInputs());

     this.dialogService.closeEventEmitter().subscribe(() => {
      this.dialogService.hideDialog([
        this.closeDialogEmitterSubscription,
        this.trueAnswearDialogEmitterSubscription
      ]);

      this.redirectToLoadboard();
    });

    this.dialogService.trueEventEmitter().subscribe(() => {
      this.dialogService.hideDialog([
        this.closeDialogEmitterSubscription,
        this.trueAnswearDialogEmitterSubscription
      ]);

      this.redirectToLoadboard();
    });
  }

  private computeSuccessDialogInputs() {
    return [
      {
        name: 'headerText',
        value: 'Company profile successfully created!'
      },
      {
        name: 'displayCancel',
        value: false
      },
      {
        name: 'rightButtonText',
        value: 'Ok'
      },
      {
        name: 'displayAfirmative',
        value: true
      },
    ];
  }

  private redirectToLoadboard() {
    setTimeout(() => {
      this.router.navigate(['loadboard']);
    }, 700);
  }

  public toggleInsuranceDocumentsStepper() {
    this.displayInsuranceDocumentsStepper = !this.displayInsuranceDocumentsStepper;
  }

  private getCountryCode() {
    const countryLookUp = this.contriesList.find(country => country.name === this.country.value);
    return countryLookUp.code;
  }

  private checkVatNumber() {
    if (!this.country.value) {
      return;
    }
    this.userService.checkVatNumber({
      countryCode: this.getCountryCode(),
      vatNumber: this.vatNumber.value
    }).subscribe(response => {
      if (!response.valid) {
        this.vatNumber.setErrors({ invalidVatNumber: true });
      } else {
        this.vatNumber.setErrors(null);
      }
    });
  }

  private toggleVatNumberError(resetFlag: boolean, error?: string) {
    if (resetFlag) {
      this.displayInvalidVatNumberError = false;
      this.invalidVatNumberError = '';
      return; 
    }
    this.displayInvalidVatNumberError = true;
    this.invalidVatNumberError = error;
  }

  // private uploadInsuranceDocuments() {
  //   console.log("--> uploadInsuranceDocuments()");
  //   this.userService.uploadInsuranceDocuments(this.insuranceDocuments).pipe(takeUntil(this.componentDestroyed$)).subscribe(response => {
  //     console.log("Response.. " + JSON.stringify(response));
  //   });
  // }

  // private uploadOperatingLicense() {
  //   console.log("--> uploadOperatingLicense()");
  //   this.userService.uploadOperatingLicense(this.operatingLicense).pipe(takeUntil(this.componentDestroyed$)).subscribe(response => {
  //     console.log("Response.. " + JSON.stringify(response));
  //   });
  // }

  public ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}


