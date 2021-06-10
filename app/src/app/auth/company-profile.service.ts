import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const env = 'http://localhost:3000/';

@Injectable({
  providedIn: 'root'
})
export class CompanyProfileService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public signup() {
    return this.httpClient.post<any>(
      env + 'signup',
      {
        body: 'dummy data'
      }
    );
  }
}
