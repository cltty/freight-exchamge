import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { postcodeValidator, postcodeValidatorExistsForCountry } from 'postcode-validator';
import validateVat, {CountryCodes, ViesValidationResponse} from 'validate-vat-ts';

export class CustomValidators {
    // public static validatePasswordsEquality(controlName: string, matchingControlName: string): ValidatorFn {
    //     return (control: AbstractControl): { [key: string]: boolean } | null => {
    //         return (control.value && control.value.match(/^.*?(?=[\^#%&$\*:.;!<>\?/\{\|\}]).*$/)) 
    //             ? { invalidCharacters: true } : null;  
    //     };
    // }

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

    // public static vatValidator(): ValidatorFn {
    //     const consumer = async () => {
    //         try {
    //           const validationInfo: ViesValidationResponse = await validateVat(CountryCodes.Germany, "12323");
    //         } catch (e) {
    //           console.log(e);
    //         }
    //       }


    //     return (control: AbstractControl): { [key: string]: boolean } | null => {
    //         return (control.value.length < 10 || control.value.length > 12) 
    //             ? { invalidPhoneNumber: true } : null;  
    //     };
    // }

//   public static validateYear(year: number): ValidatorFn {
//     return (control: AbstractControl): { [key: string]: boolean } | null => {
//       if (control.value && !CustomValidators.dateInAccountantYear(control.value, year)) {
//         return { invalidYear: true };
//       }
//       return null;
//     };
//   }

//   private static dateInAccountantYear(selectedDate: string, year: number): boolean {
//     const startDateOfYear = new Date('04/06/' + (year - 1));
//     const endDateOfYear = new Date('04/06/' + year);
//     const selectedDateofYear = new Date(selectedDate);
//     return (
//       selectedDateofYear.getTime() <= endDateOfYear.getTime() &&
//       selectedDateofYear.getTime() >= startDateOfYear.getTime()
//     );
//   }
}
