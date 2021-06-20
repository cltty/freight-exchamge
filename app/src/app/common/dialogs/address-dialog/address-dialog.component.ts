import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../validators/custom-validator';

@Component({
  selector: 'app-address-dialog',
  templateUrl: './address-dialog.component.html',
  styleUrls: ['./address-dialog.component.scss']
})
export class AddressDialogComponent implements OnInit {
  @Output()
  public closeAddressEventEmitter: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public addressSelectedEventEmitter: EventEmitter<any> = new EventEmitter<any>();

  public options = {
    region:'EU',
    types: ['(cities)']
  }

  public addressForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.addressForm = this.formBuilder.group({
      address: ['', [ Validators.required, CustomValidators.forbiddenCharacters() ]]
    });
  }

  get address() {
    return this.addressForm.get('address');
  }

  ngOnInit(): void {
  }

  private findFirstDigitIndex(s: string) {
    let first = -1;
    let last = -1;

    for (let i = 0; i < s.length; i++) {
        var c = s[i];
        if (c >= '0' && c <= '9') {
            if (first < 0) {
                first = i;
            } 
            last = i;
        }
    }
    
    return { 
        first: first,
        last: last
    };
  }

  private trimDigits(s: string) {
    let index = this.findFirstDigitIndex(s);

    if (index.first === -1 || index.last === -1) {
        return s;
    }
    
    if (index.first === 0) {
      return s.slice(index.last + 1, s.length);  
    }

    return (s.slice(0, s.charAt(index.first) === ' ' ? index.first - 2 : index.first - 1)
    + s.slice(index.last + 1, s.length));
  }


  public handleAddressChange(address: any) {
    console.log('handleAddressChange > ', address.formatted_address);
    this.address.setValue(address.formatted_address);
  }

  public onClose() {
    this.closeAddressEventEmitter.emit();
  }

  public onAddressSelected() {
    this.addressSelectedEventEmitter.emit(
      {
        addressRaw: this.address.value,
        prettyfiedAddress: this.trimDigits(this.address.value)
      }
    );
  }

}
