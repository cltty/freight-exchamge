import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'freight-xchange-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) { 
    this.loginForm = this.formBuilder.group({
      emailAddress: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    console.log("Login comp!");
  }

  get emailAddress() {
    return this.loginForm.get('emailAddress');
  }

  get password() {
    return this.loginForm.get('password');
  }

  public test() {
    console.log("test :: ", this.password.value);
  }

  public submitForm() {
    console.log("Submit form");
  }

  public redirectToRegister() {
    //disable button
    //display spinner
    setTimeout(() => {
      this.router.navigate(['get-started/register']);
    }, 700);
  }

}
