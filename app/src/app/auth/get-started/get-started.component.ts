import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'freight-xchange-get-started',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.scss']
})
export class GetStartedComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  public redirectToRegister() {
    setTimeout(() => {
      this.router.navigate(['get-started/register']);
    }, 700);
  }

  public redirectToLogin() {
    setTimeout(() => {
      this.router.navigate(['login']);
    }, 700);
  }

}
