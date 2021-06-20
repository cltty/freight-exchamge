import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationDialogComponent } from 'src/app/common/dialogs/notification-dialog/notification-dialog.component';
import { CustomValidators } from 'src/app/common/validators/custom-validator';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @ViewChild('dialog', { read: ViewContainerRef })
  public dialogContainer: ViewContainerRef;

  public siteKey: string = '6Lf3OPwaAAAAACDAWgSCyUBOer_nSTTSjhY_ATyt';
  
  public registerForm: FormGroup;
  public displaySpinner: boolean = false;
  public hideForm: boolean = false;
  public spinnerText: string = "Please wait.."
  public signupSuccessfulMessage: string = "Sign up successful! You will redirected soon!"

  private closeDialogEmitterSubscription: Subscription;
  private trueAnswearDialogEmitterSubscription: Subscription;

  private componentDestroyed$: Subject<any> = new Subject();

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private dialogService: DialogService
  ) { 
    this.registerForm = this.formBuilder.group({
      emailAddress: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required, CustomValidators.forbiddenCharacters()]),
      repeatPassword: new FormControl('', [Validators.required, CustomValidators.forbiddenCharacters()]),
      recaptcha: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log("Register comp!");
  }

  get fg(){
    return this.registerForm.controls;
  }

  get emailAddress() {
    return this.registerForm.get('emailAddress');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get repeatPassword() {
    return this.registerForm.get('repeatPassword');
  }

  get recaptcha() {
    return this.registerForm.get('recaptcha');
  }

  private isFormValid(form: FormGroup) {
    if (this.password.value !== this.repeatPassword.value) {
      this.repeatPassword.setErrors({ passwordsNotMatching: true });
    }
    
    return this.registerForm.valid;
  }

  public submitForm() {
    if (this.isFormValid(this.registerForm)) {
      this.displaySpinner = true;

      setTimeout(() => {
        this.displaySpinner = false;
        this.hideForm = true;
      }, 1000);

      this.authService.createUser(this.computeRequestPayload)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(() => {
        this.openSuccessDialog();
        // const dialogRef = this.dialog.open(RegisterSucessfulDialogComponent);

        // dialogRef.afterClosed().pipe(takeUntil(this.componentDestroyed$)).subscribe(result => {
        //   // redirect
        // });
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

  private computeRequestPayload() {
    return {
      // uniqueID: this.computeUniqueID(),
      emailAddress: this.emailAddress.value,
      password: this.password.value
    };
  }

  public handleReset() {
    console.log('handleReset');
  }

  public handleExpire() {
    console.log('handleExpire');
  }

  public handleLoad() {
    console.log('handleLoad');
  }

  public handleSuccess(event: any) {
    console.log('handleSuccess');
  }

  public debug() {
    console.log("Debug..");
    console.log("Form erros : ", this.registerForm.errors);
    console.log("this.emailAddress.errors : ", this.emailAddress.errors);
  }

  private openSuccessDialog() {
    const inputs = [
      {
        name: 'headerText',
        value: 'Successfully registered!'
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
    ]
    this.dialogService.showDialog(this.dialogContainer, NotificationDialogComponent, inputs);

     this.dialogService.closeEventEmitter().subscribe(() => {
      this.dialogService.hideDialog([
        this.closeDialogEmitterSubscription,
        this.trueAnswearDialogEmitterSubscription
      ]);
      
      console.log("> onClose > Redirecting to create-profile..");
    });

    this.dialogService.trueEventEmitter().subscribe(() => {
      this.dialogService.hideDialog([
        this.closeDialogEmitterSubscription,
        this.trueAnswearDialogEmitterSubscription
      ]);
      console.log("> Redirecting to create-profile..");
    });
  }

  private openFailDialog(errorMessage: string) {
    console.log('openFailDialog');
    const inputs = [
      {
        name: 'headerText',
        value: errorMessage
      },
      {
        name: 'leftButtonText',
        value: 'Ok'
      },
      {
        name: 'displayCancel',
        value: true
      },
      {
        name: 'displayAfirmative',
        value: false
      },
    ]
    this.dialogService.showDialog(this.dialogContainer, NotificationDialogComponent, inputs);

     this.dialogService.closeEventEmitter().subscribe(() => {
      this.dialogService.hideDialog([
        this.closeDialogEmitterSubscription,
        this.trueAnswearDialogEmitterSubscription
      ]);
      
      console.log("> onClose > registerFailedDialog..");
    });

    this.dialogService.trueEventEmitter().subscribe(() => {
      this.dialogService.hideDialog([
        this.closeDialogEmitterSubscription,
        this.trueAnswearDialogEmitterSubscription
      ]);
      console.log("> registerFailedDialog..");
    });
  }

  public failDialog() {
    console.log('failDialog');
    this.openFailDialog('Email already address in use!');
  }

  public displayDialog() {
    this.openSuccessDialog();
    
    // const inputs = [
    //   {
    //     name: 'headerText',
    //     value: 'Successfully registered!'
    //   },
    //   {
    //     name: 'leftButtonText',
    //     value: 'Close'
    //   },
    //   {
    //     name: 'rightButtonText',
    //     value: 'Ok'
    //   }
    // ]
    // this.dialogService.showDialog(this.dialogContainer, NotificationDialogComponent, inputs);

    // this.dialogService.closeEventEmitter().subscribe(() => {
    //   this.dialogService.hideDialog([
    //     this.closeDialogEmitterSubscription//,
    //     // this.trueAnswearDialogEmitterSubscription
    //   ]);
      
    //   console.log("> onClose");
    // });

    // this.dialogService.trueEventEmitter().subscribe(() => {
    //   this.dialogService.hideDialog([
    //     this.closeDialogEmitterSubscription,
    //     this.trueAnswearDialogEmitterSubscription
    //   ]);
    //   console.log("> onTrue");
    // });

  }

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

}
