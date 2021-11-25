import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReCaptcha2Component } from 'ngx-captcha';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationDialogComponent } from 'src/app/common/dialogs/notification-dialog/notification-dialog.component';
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

  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;

  public siteKey;

  public registerForm: FormGroup;

  private closeDialogEmitterSubscription: Subscription;
  private trueAnswearDialogEmitterSubscription: Subscription;

  private componentDestroyed$: Subject<any> = new Subject();

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private dialogService: DialogService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      emailAddress: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required]),
      repeatPassword: new FormControl('', [Validators.required]),
      recaptcha: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.authService.captchaSiteKey$.pipe(takeUntil(this.componentDestroyed$)).subscribe(key => this.siteKey = key);
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

  private isFormValid() {
    if (this.password.value !== this.repeatPassword.value) {
      this.repeatPassword.setErrors({ passwordsNotMatching: true });
    }

    return this.registerForm.valid;
  }

  public submitForm() {
    if (this.isFormValid()) {
      this.authService.createUser(this.computeRequestPayload())
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
        () => {
          this.openSuccessDialog();
        },
        err => {
          if (err.status === 400) {
            this.openFailDialog('Email address already in use!');
          }
        }
      );
    }
  }

  private computeRequestPayload() {
    return {
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

  private openSuccessDialog() {
    const inputs = [
      {
        name: 'headerText',
        value: 'Congratulations! You will have to login in order to proceed with the next step!'
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

      this.redirectToLogin();
    });

    this.dialogService.trueEventEmitter().subscribe(() => {
      this.dialogService.hideDialog([
        this.closeDialogEmitterSubscription,
        this.trueAnswearDialogEmitterSubscription
      ]);

      this.redirectToLogin();
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

      this.resetForm();
    });

    this.dialogService.trueEventEmitter().subscribe(() => {
      this.dialogService.hideDialog([
        this.closeDialogEmitterSubscription,
        this.trueAnswearDialogEmitterSubscription
      ]);

      this.resetForm();
    });
  }

  private redirectToLogin() {
    setTimeout(() => {
      this.router.navigate(['login']);
    }, 700);
  }

  private resetForm() {
    this.registerForm.reset();
    this.emailAddress.setErrors(null);
    this.password.setErrors(null);
    this.repeatPassword.setErrors(null);
    this.captchaElem.resetCaptcha();
  }

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

}
