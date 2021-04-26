import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

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
