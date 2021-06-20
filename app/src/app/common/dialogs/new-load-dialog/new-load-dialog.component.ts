import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DashboardService } from 'src/app/dashboard/service/dashboard.service';
import { animations } from '../../utils/animations';
import { CustomValidators } from '../../validators/custom-validator';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { AddressDialogComponent } from '../address-dialog/address-dialog.component';

@Component({
  selector: 'app-new-load-dialog',
  templateUrl: './new-load-dialog.component.html',
  styleUrls: ['./new-load-dialog.component.scss'],
  animations: [animations.dialogAnimation, animations.modalBgFadeIn]
})
export class NewLoadDialogComponent implements OnInit {
  @ViewChild('dialog', { read: ViewContainerRef })
  public dialogContainer: ViewContainerRef;
  
  @Input()
  public companyProfile: any;

  @Output()
  public closeEventEmitter: EventEmitter<void> = new EventEmitter<void>();
  
  @Output()
  public successEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  public equipmentTypes: string[] = [
    "Curtain Side Trailed",
    "Box Trailer"
  ];

  public isEquipmentRequiredOptions: string[] = [
    "True",
    "False"
  ];

  public newLoadForm: FormGroup;

  private closeAddressDialogEmitterSubscription: Subscription;
  private addressSelectedEmitterSubscription: Subscription;

  public addressDialogOpened = false;

  private componentDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private dashboardService: DashboardService,
    private dialogService: DialogService
    ) {
    this.newLoadForm = this.formBuilder.group({
      originCity: ['', [ Validators.required, CustomValidators.forbiddenCharacters() ]],
      originCountry: ['', [ Validators.required, CustomValidators.forbiddenCharacters() ]],
      fullOriginAddress: [''],
      originArrival: ['', Validators.required ],
      destinationCity: ['', [ Validators.required, CustomValidators.forbiddenCharacters() ]],
      destinationCountry: ['', [ Validators.required, CustomValidators.forbiddenCharacters() ]],
      fullDestinationAddress: [''],
      destinationArrival: ['', Validators.required],
      distance: [''],
      payout: ['', [ Validators.required, CustomValidators.forbiddenCharacters() ]],
      equipment: ['', Validators.required],
      isEquipmentRequired: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.setInitialFormValues();
  }

  // needed?
  private setInitialFormValues() {
    this.originCity.setValue(null);
    this.originCountry.setValue(null);
    this.fullOriginAddress.setValue(null);
    this.originArrival.setValue(null);
  }

  get cityControl() {
    return this.newLoadForm.get('cityControl');
  }

  get originCity() {
    return this.newLoadForm.get('originCity');
  }

  get originCountry() {
    return this.newLoadForm.get('originCountry');
  }

  get fullOriginAddress() {
    return this.newLoadForm.get('fullOriginAddress');
  }

  get originArrival() {
    return this.newLoadForm.get('originArrival');
  }

  get destinationCity() {
    return this.newLoadForm.get('destinationCity');
  }

  get destinationCountry() {
    return this.newLoadForm.get('destinationCountry');
  }

  get fullDestinationAddress() {
    return this.newLoadForm.get('fullDestinationAddress');
  }

  get destinationArrival() {
    return this.newLoadForm.get('destinationArrival');
  }

  get distance() {
    return this.newLoadForm.get('distance');
  }

  get payout() {
    return this.newLoadForm.get('payout');
  }

  get equipment() {
    return this.newLoadForm.get('equipment');
  }

  get isEquipmentRequired() {
    return this.newLoadForm.get('isEquipmentRequired');
  }

  public isFormValid() {
    for(let item in this.newLoadForm.controls){
      if (this.newLoadForm.controls[item].errors) {
        return false;
      }
    }
    return true;
  }

  public inputChangeEquipment(event: any, inputField: string) {
    this.newLoadForm.get(inputField).setValue(event.value);
  }

  public inputChange(event: any, inputField: string) {
    this.newLoadForm.get(inputField).setValue(event.target.value);
  }

  public computeNewLoadPayload() {
    return {
      cancelled: false,
      rejected: false,
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
        city: this.originCity.value,
        country: this.originCountry.value,
        arrival: this.originArrival.value
      },
      destination: {
        city: this.destinationCity.value,
        country: this.destinationCountry.value,
        arrival: this.destinationArrival.value
      },
      distance: this.distance.value,
      payout: this.payout.value,
      equipment: {
        equipment: this.equipment.value,
        isRequired: this.toBoolean(this.isEquipmentRequired.value)
      }
    }
  }

  public onSubmit() {
    this.newLoadForm.markAllAsTouched()
    this.dashboardService.createNewLoad(this.computeNewLoadPayload()).pipe(takeUntil(this.componentDestroyed$))
      .subscribe(() => {
          setTimeout(() => {
            this.onSuccess(true);
          }, 500);
        }
      );
  }

  public onClose() {
    this.closeEventEmitter.emit();
  }

  public onSuccess(successfullyCreated: boolean) {
    this.successEventEmitter.emit(successfullyCreated)
  }

  public onOriginAddressSelect() {
    this.addressDialogOpened = true;
    this.dialogService.showAddressDialog(this.dialogContainer, AddressDialogComponent, []);

    this.dialogService.closeAddressDialogEventEmitter().subscribe(() => {
      this.dialogService.hideAddressDialog([
        this.closeAddressDialogEmitterSubscription,
        this.addressSelectedEmitterSubscription
      ]);

      this.addressDialogOpened = false;
    });

    this.dialogService.addressSelectedEventEmitter().subscribe(address => {
      this.dialogService.hideAddressDialog([
        this.closeAddressDialogEmitterSubscription,
        this.addressSelectedEmitterSubscription
      ]);

      this.setOriginAddress(address.prettyfiedAddress);
      this.addressDialogOpened = false;
    });
  }

  public onDestinationAddressSelect() {
    if (!this.isOriginSelected) return;

    this.addressDialogOpened = true;
    this.dialogService.showAddressDialog(this.dialogContainer, AddressDialogComponent, []);

    this.dialogService.closeAddressDialogEventEmitter().subscribe(() => {
      this.dialogService.hideAddressDialog([
        this.closeAddressDialogEmitterSubscription,
        this.addressSelectedEmitterSubscription
      ]);

      this.addressDialogOpened = false;
    });

    this.dialogService.addressSelectedEventEmitter().subscribe(address => {
      this.dialogService.hideAddressDialog([
        this.closeAddressDialogEmitterSubscription,
        this.addressSelectedEmitterSubscription
      ]);

      this.setDestinationAddress(address.prettyfiedAddress);
      this.addressDialogOpened = false;
      this.destinationCountry.setErrors(null);
    });
  }

  private setOriginAddress(address: string) {
    this.originCity.setValue(address.split(', ')[0]);
    this.originCountry.setValue(address.split(', ')[1]);
    this.fullOriginAddress.setValue(address);
  }

  private setDestinationAddress(address: string) {
    this.destinationCity.setValue(address.split(', ')[0]);
    this.destinationCountry.setValue(address.split(', ')[1]);
    this.fullDestinationAddress.setValue(address);
    this.getDistanceBetweenCities();
  }

  public getDistanceBetweenCities() {
    let payload = {
      origins: this.fullOriginAddress.value,
      destinations: this.fullDestinationAddress.value
    }
    this.dashboardService.getDistanceBetweenCities(payload).pipe(takeUntil(this.componentDestroyed$))
    .subscribe(
      distance => {
        this.distance.setValue(distance.distance);
      },
      err => {
        if (err.error.distance) {
          this.destinationCountry.setErrors({ unreachable: true });
        }
      }
    )
  }

  private isOriginSelected(): boolean {
    return (this.fullOriginAddress.value && this.originArrival.value);
  }

  private toBoolean(value): Boolean {
    return value === "True" ? true : false;
  }

}
