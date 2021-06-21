import { Component, Input, OnInit } from '@angular/core';
import { CompanyProfile } from 'src/app/auth/create-profile/models/CompanyProfile';

@Component({
  selector: 'fx-company-account',
  templateUrl: './company-account.component.html',
  styleUrls: ['./company-account.component.scss']
})
export class CompanyAccountComponent implements OnInit {
  @Input()
  public companyProfile: CompanyProfile;

  constructor() { }

  ngOnInit(): void {
  }

}
