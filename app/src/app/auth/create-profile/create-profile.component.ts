import { Component, OnInit, ViewChild } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class CreateProfileComponent implements OnInit {
  @ViewChild('stepper') stepper;

  public companyTypes: string[] = [
    "Shipper",
    "Carrier"
  ];

  public contriesList: string[] = [
    "Roumania",
    "Italy",
    "Greek",
    "Roumania",
    "Italy",
    "Greek",
    "Roumania",
    "Italy",
    "Greek",
    "Roumania",
    "Italy",
    "Greek",
    "Roumania",
    "Italy",
    "Greek",
    "Roumania",
    "Italy",
    "Greek"
  ];

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      companyLegalName: [''],
      companyType: [''],
      addressLine1: [''],
      addressLine2: [''],
      phoneNumber: [''],
      postcode: [''],
      domiciles: [''],
      countryName: [''],
      vatNumber: ['']
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['']
    });
  }

}
