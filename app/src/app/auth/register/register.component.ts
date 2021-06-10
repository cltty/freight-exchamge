import { HIGH_CONTRAST_MODE_ACTIVE_CSS_CLASS } from '@angular/cdk/a11y/high-contrast-mode/high-contrast-mode-detector';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustomValidators } from 'src/app/common/validators/custom-validator';
import { AuthService } from '../auth.service';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private componentDestroyed$: Subject<any> = new Subject();
  
  public registerForm: FormGroup;
  public displaySpinner: boolean = false;
  public hideForm: boolean = false;
  public spinnerText: string = "Please wait.."
  public signupSuccessfulMessage: string = "Sign up successful! You will redirected soon!"
  
  /**
   * TO DO:
   * checkbox validation
   * spinner text animation
   */

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) { 
    this.registerForm = this.formBuilder.group({
      /* name: new FormControl('', [Validators.required, CustomValidators.forbiddenCharacters()]), */
      emailAddress: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required, CustomValidators.forbiddenCharacters()]),
      repeatPassword: new FormControl('', [Validators.required, CustomValidators.forbiddenCharacters()]),
    });
  }

  // enable button when form is valid

  ngOnInit(): void {
    console.log("Register comp!");
  }

  get fg(){
    return this.registerForm.controls;
  }

  // get name() {
  //   return this.registerForm.get('name');
  // }


  get emailAddress() {
    return this.registerForm.get('emailAddress');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get repeatPassword() {
    return this.registerForm.get('repeatPassword');
  }

  private isFormValid(form: FormGroup) {
    if (this.password.value !== this.repeatPassword.value) {
      this.repeatPassword.setErrors({ passwordsNotMatching: true });
    }
    
    return this.registerForm.valid;
  }

  public submitForm() {
    console.log("submitForm!");

    if (this.isFormValid(this.registerForm)) {
      console.log("FORM VALID");
      this.displaySpinner = true;


      setTimeout(() => {
        this.displaySpinner = false;
        this.hideForm = true;
      }, 1000);
      //submit to BE

      const requestPayload = {
        uniqueID: this.computeUniqueID(),
        emailAddress: this.emailAddress.value,
        password: this.password.value
      }

      this.authService.createUser(requestPayload)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(response => {
        console.log("createUser response : ", response);
      });

      // this.authService.signup()
      //   .pipe(takeUntil(this.componentDestroyed$))
      //   .subscribe(response => {
      //     console.log("authService.signup() => ", response)
      // });
    } else {
      console.log("FORM INVALID");
    }

    


    //POST http call
  }

  public computeUniqueID() {
    return 'uniqueID';
  }

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

}
