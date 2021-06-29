import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { postcodeValidator, postcodeValidatorExistsForCountry } from 'postcode-validator';
import validateVat, {CountryCodes, ViesValidationResponse} from 'validate-vat-ts';

export class CustomValidators {
    public static forbiddenCharacters(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            return (control.value && control.value.match(/^.*?(?=[\^#%&$\*:.;!<>\?/\{\|\}]).*$/)) 
                ? { invalidCharacters: true } : null;  
        };
    }

    public static onlyDigits(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            return (/^\d+$/.test(control.value)) 
                ? null : { onlyDigitsError: true };  
        };
    }

    public static postCodeValidator(formGroup: FormGroup): { [key: string]: boolean} | null {
        return formGroup.get('country').value &&
            !postcodeValidator(formGroup.get('postcode')?.value, formGroup.get('country')?.value.code)
            ? { invalidPostcode: true }
            : null;
    }

    public static phoneNumberValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            return (control.value.length < 10 || control.value.length > 12) 
                ? { invalidPhoneNumber: true } : null;  
        };
    }
}
