import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/common/validators/custom-validator';
import { DashboardService } from '../service/dashboard.service';

@Component({
  selector: 'fx-create-load-dialog',
  templateUrl: './create-load-dialog.component.html',
  styleUrls: ['./create-load-dialog.component.scss']
})
export class CreateLoadDialogComponent implements OnInit {
  public equipmentTypes: string[] = [
    "Curtain Side Trailed",
    "Box Trailer"
  ];

  public isEquipmentRequiredOptions: string[] = [
    "True",
    "False"
  ];

  public isFormPristine: boolean = true;

  public newLoadForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private dashboardService: DashboardService) {
    this.newLoadForm = this.formBuilder.group({
      originCity: ['', [ Validators.required, CustomValidators.forbiddenCharacters() ]],
      originCountry: ['', [ Validators.required, CustomValidators.forbiddenCharacters() ]],
      originZipcode: ['', [ Validators.required, CustomValidators.forbiddenCharacters() ]],
      originArrival: ['', Validators.required ],
      destinationCity: ['', [ Validators.required, CustomValidators.forbiddenCharacters() ]],
      destinationCountry: ['', [ Validators.required, CustomValidators.forbiddenCharacters() ]],
      destinationZipcode: ['', [ Validators.required, CustomValidators.forbiddenCharacters()]],
      destinationArrival: ['', Validators.required],
      distance: [''],
      payout: ['', [ Validators.required, CustomValidators.forbiddenCharacters() ]],
      equipment: ['', Validators.required],
      isEquipmentRequired: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  get originCity() {
    return this.newLoadForm.get('originCity');
  }

  get originCountry() {
    return this.newLoadForm.get('originCountry');
  }

  get originZipcode() {
    return this.newLoadForm.get('originZipcode');
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

  get destinationZipcode() {
    return this.newLoadForm.get('destinationZipcode');
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
      originCity: this.originCity.value,
      originCountry: this.originCountry.value,
      originZipcode: this.originZipcode.value,
      originArrival: this.originArrival.value,
      destinationCity: this.destinationCity.value,
      destinationCountry: this.destinationCountry.value,
      destinationZipcode: this.destinationZipcode.value,
      destinationArrival: this.destinationArrival.value,
      distance: this.distance.value,
      payout: this.payout.value,
      equipment: this.equipment.value,
      isEquipmentRequired: this.toBoolean(this.isEquipmentRequired.value),
    }
  }

  public onSubmit() {
    console.log("onSubmit()");
    this.dashboardService.createNewLoad$.next(this.computeNewLoadPayload());
  }

  private toBoolean(value): Boolean {
    return value === "True" ? true : false;
  }
}
