import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from 'src/app/user-service/user.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'freight-xchange-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public siteKey;
  public wrongCredentials: boolean = false;
  
  private componentDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ) { 
    this.loginForm = this.formBuilder.group({
      emailAddress: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required]),
      recaptcha: ['', Validators.required]
    });
  }
  
  ngOnInit(): void {
    this.authService.captchaSiteKey$.pipe(takeUntil(this.componentDestroyed$)).subscribe(key => this.siteKey = key);
  }

  get emailAddress() {
    return this.loginForm.get('emailAddress');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get recaptcha() {
    return this.loginForm.get('recaptcha');
  }

  public submitForm() {
    this.authService.loginUser(this.computeUserLoginPayload()).subscribe(response => {
      
      this.userService.setUserEmailAddress(this.emailAddress.value);
      this.userService.setUserId(response.userId);

      if (!response.companyProfileCreated) {
        this.router.navigateByUrl('create-profile');
      } else {
        this.userService.setCompanyType(response.companyType);
        this.router.navigateByUrl('loadboard');
      }
    });
  }

  private computeUserLoginPayload() {
    return {
      emailAddress: this.emailAddress.value,
      password: this.password.value
    };
  }

  public redirectToRegister() {
    setTimeout(() => {
      this.router.navigate(['get-started/register']);
    }, 700);
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


  public ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

}
