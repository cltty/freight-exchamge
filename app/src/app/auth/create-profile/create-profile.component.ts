import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { countries } from './models/countries_array/contries_array';
import { Country } from './models/contry';
import { MatFileUploadModule } from 'angular-material-fileupload';
import { FileUploadType } from './models/FileUploadType';
import { DeleteUploadedFileDialogComponent } from 'src/app/common/delete-uploaded-file-dialog/delete-uploaded-file-dialog.component';
import { CustomValidators } from 'src/app/common/validators/custom-validator';
import { AuthService } from '../auth.service';
import { CompanyProfile } from './models/CompanyProfile';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { postcodeValidator, postcodeValidatorExistsForCountry } from 'postcode-validator';
import { MatStepper } from '@angular/material/stepper';
import { ValidatorService } from 'angular-iban';
import validateVat, {CountryCodes, ViesValidationResponse} from 'validate-vat-ts';
import { UserService } from 'src/app/user-service/user.service';

@Component({
  selector: 'create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class CreateProfileComponent implements OnInit {
  // @ViewChild('stepper') stepper;

  public companyTypes: string[] = [
    "Shipper",
    "Carrier"
  ];

  @ViewChild('dummyFileInput', { static: false }) dummyFileInput: ElementRef;

  public contriesList: Country[] = countries;
  public imgsArray: any[] = [];
  public imgUrlsArray: any[] = [];
  public pdfSrc: any;

  public errorMessage: string;
  public url: any;

  public insuranceDocuments: any = [];
  public operatingLicense: FileUploadType[] = [];
  public operatingLicenseCount: number = 0;

  public companyDetailsForm: FormGroup;
  public equipmentInvetoryForm: FormGroup;
  public insuranceForm: FormGroup;
  public paymentDetailsForm: FormGroup;

  public displayInvalidVatNumberError: boolean = false;
  public invalidVatNumberError: string;

  public displaySpinner: boolean = false;
  
  private componentDestroyed$: Subject<void> = new Subject<void>();
  private isVatNumberValid$: Subject<boolean> = new Subject<boolean>();
  

  // private pdfFile: File;
  // private selectedFile: File = null;
  // private fd = new FormData();


  public displayInsuranceDocumentsStepper = false;

  public readyToSubmit: string = "Please fill in the form or check for any errors.";

  @ViewChild("stepper", { static: false }) stepper: MatStepper;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService
    ) {
    this.companyDetailsForm = this.formBuilder.group({
      companyLegalName: ['', [ Validators.required, CustomValidators.forbiddenCharacters() ]],
      companyType: ['', [ Validators.required, CustomValidators.forbiddenCharacters() ]],
      addressLine1: ['', [ Validators.required, CustomValidators.forbiddenCharacters() ]],
      addressLine2: ['', [ CustomValidators.forbiddenCharacters() ]],
      city: ['', [ Validators.required, CustomValidators.forbiddenCharacters() ]],
      state: ['', [ CustomValidators.forbiddenCharacters() ]],
      phoneNumber: ['', [ Validators.required, CustomValidators.forbiddenCharacters(), CustomValidators.phoneNumberValidator() ]],
      postcode: ['', [ Validators.required, CustomValidators.forbiddenCharacters() ]],
      domiciles: [''],
      countryName: ['', [ Validators.required ]],
      vatNumber: ['', [ Validators.required, CustomValidators.forbiddenCharacters() ]]
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

  ngOnInit(): void {
    this.companyDetailsForm.setValidators(CustomValidators.postCodeValidator);
  }

  public hasErrors() {
    console.log(" -> ", this.hasCompanyDetailsFormErrors());
  }

  get companyLegalName() {
    return this.companyDetailsForm.get('companyLegalName');
  }

  get state() {
    return this.companyDetailsForm.get('state');
  }

  get city() {
    return this.companyDetailsForm.get('city');
  }

  get companyType() {
    return this.companyDetailsForm.get('companyType');
  }

  get addressLine1() {
    return this.companyDetailsForm.get('addressLine1');
  }

  get addressLine2() {
    return this.companyDetailsForm.get('addressLine2');
  }

  get phoneNumber() {
    return this.companyDetailsForm.get('phoneNumber');
  }

  get postcode() {
    return this.companyDetailsForm.get('postcode');
  }

  get domiciles() {
    return this.companyDetailsForm.get('domiciles');
  }

  get countryName() {
    return this.companyDetailsForm.get('countryName');
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
    console.log(">> inputChangeCompanyDetailsForm()")
    // console.log("-> event = ", event);
    // console.log("-> inputField = ", inputField);
    if (
      inputField === 'countryName' ||
      inputField === 'domiciles' ||
      inputField === 'companyType'
    ) {
      this.companyDetailsForm.get(inputField).setValue(event.value);
      return;
    }
    this.companyDetailsForm.get(inputField).setValue(event.target.value);
  }


  public inputChangeEquipmentInvetoryForm(event: any, inputField: string) {
    this.equipmentInvetoryForm.get(inputField).setValue(event.target.value);
  }

  public inputChangePaymentDetailsForm(event: any, inputField: string) {
    this.paymentDetailsForm.get(inputField).setValue(event.target.value);
  }

  public onInsuranceFilesChanged($event) {
    console.log(">> onFileChanged");
    // this.pdfFile = $event.target.files[0];
    // this.selectedFile = <File>$event.target.files[0];
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
    console.log(">> onOperatingFileChanged");
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

  public testPaymentDetailsForm() {
    console.log(">> testPaymentDetailsForm");
    console.log(this.paymentDetailsForm);
  }

  public hasCompanyDetailsFormErrors() {
    return this.companyLegalName.errors ||
          this.companyType.errors || 
          this.addressLine1.errors ||
          this.addressLine2.errors ||
          this.city.errors ||
          this.state.errors ||
          this.phoneNumber.errors ||
          this.postcode.errors ||
          this.domiciles.errors ||
          this.countryName.errors ||
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
      emailAddress: this.authService.getUserMailAddress(),
      companyDetails: {
        companyLegalName: this.companyLegalName.value,
        companyType: this.companyType.value,
        vatNumber: this.vatNumber.value,
        state: this.state.value,
        city: this.city.value,
        addressLine1: this.addressLine1.value,
        addressLine2: this.addressLine2.value,
        phoneNumber: this.phoneNumber.value,
        postcode: this.postcode.value,
        domiciles: this.domiciles.value,
        countryName: this.countryName.value,
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

      profilePayload.insuranceDocuments = this.insuranceDocuments;
      profilePayload.operatinLicense = this.operatingLicense;

    }

    return profilePayload;
  }

  public submitProfile() {
    // console.log("Submit profile");
    // this.displaySpinner = true;

    // setTimeout(() => {
    //   this.displaySpinner = false;
    // }, 1000);

    console.log("submitProfile-->> this.isReadyForSubmit() -->> ", this.isReadyForSubmit());

    if (this.isReadyForSubmit()) {
      const profilePayload = this.computePayload();
      console.log("profilePayload -> ", profilePayload);
      switch(this.companyType.value) {
        case 'Shipper':
          console.log("-> case shipper");
          this.userService.createShipperProfile(profilePayload)
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe(response => {
                if (response === 'Error') {
                   this.displayRequestError("HTTP ERROR"); 
                }
                else {
                   this.displaySuccessMessage();
                }
          });
        break;
        case 'Carrier':
          console.log("-> case carrier");
          this.userService.createCarrierProfile(profilePayload)
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe(response => {
              console.log(">> userService.createCarrierProfile >> ", response);
                // if success -> upload documents
                if (response === 'Error') {
                   this.displayRequestError("HTTP ERROR"); 
                }
                else {
                   this.displaySuccessMessage();
                }
              });
        break;
        default:
          this.displayRequestError("Please make sure you correctly filled the form");
        break;
      }
    } else {
      this.displayRequestError("Please make sure you correctly filled the form");
    }
  }


  public displayRequestError(errorMessage: string) {
    console.log("displayRequestErrorModal() -> ", errorMessage);
  }

  public displaySuccessMessage() {
    console.log("displaySuccessMessage()");
  }

  public redirectToLoadboard() {
    console.log("redirecting to loadboard...");
  }

  public toggleInsuranceDocumentsStepper() {
    this.displayInsuranceDocumentsStepper = !this.displayInsuranceDocumentsStepper;
    console.log("companyType.value !== 'Shipper' -> ", this.companyType.value !== 'Shipper');
  }


  private checkVatNumber() {
    this.userService.checkVatNumber({
      countryCode: this.countryName.value.code,
      vatNumber: this.vatNumber.value
    }).subscribe(response => {
      if (!response.valid) {
        this.toggleVatNumberError(false, response.error);
      }
      this.isVatNumberValid$.next(response.valid)
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

  // displayInvalidVatNumberError

  public checkFormForErrors() {
    this.checkVatNumber();
    this.isVatNumberValid$.pipe(takeUntil(this.componentDestroyed$)).subscribe(flag => {
      if (flag && !this.companyDetailsForm.errors) {
        console.log("checkFormForErrors >> FORM HAS NO ERRORS!");
        // this.stepper.next();
      } else {
        // display an error message
        console.log("checkFormForErrors >> FORM HAS ERRORS!");
      }
    });
  }


  private uploadInsuranceDocuments() {
    console.log("--> uploadInsuranceDocuments()");
    this.userService.uploadInsuranceDocuments(this.insuranceDocuments).pipe(takeUntil(this.componentDestroyed$)).subscribe(response => {
      console.log("Response.. " + JSON.stringify(response));
    });
  }

  private uploadOperatingLicense() {
    console.log("--> uploadOperatingLicense()");
    this.userService.uploadOperatingLicense(this.operatingLicense).pipe(takeUntil(this.componentDestroyed$)).subscribe(response => {
      console.log("Response.. " + JSON.stringify(response));
    });
  }

  public ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}


