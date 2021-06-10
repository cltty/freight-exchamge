import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CompanyProfile } from './create-profile/models/CompanyProfile';

const env = 'http://localhost:3000/';
const AUTH_ENV = 'http://localhost:4000/';
// To be heavely refactored later

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ENV: string = 'http://localhost:4000';
  private readonly LOGIN_URL: string = '/login';
  private readonly LOGOUT_URL: string = '/logout';
  
  public wrongLoginCredentials$: Subject<void> = new Subject<void>();

  constructor(
    private httpClient: HttpClient
  ) {}

  public loginUser(userLoginPayload: any) {
    return this.httpClient.post<any>(
      this.ENV + this.LOGIN_URL, userLoginPayload
    );
  }

  public logoutUser() {
    return this.httpClient.delete<any>(
      this.ENV + this.LOGOUT_URL
    );
  }

  public createUser(requestPayload: any) {
    console.log("CREATE PAYLOAD : ", requestPayload);
    return this.httpClient.post<any>(
      env + 'user', requestPayload
    );
  }

public createShipperProfile(profilePayload: CompanyProfile) {
  return this.httpClient.post<any>(
    env + 'create/shipper', profilePayload
  );
  }

public createCarrierProfile(profilePayload: CompanyProfile) {
  return this.httpClient.post<any>(
    env + 'create/carrier', profilePayload
  );
}

public getUserMailAddress() {
  return "dummyData@gmail.com";
}

  /**
   * When creating user profile, on the backend creation
   * of the SCAC code has to be handled
   * 
   * on BE getUser & getProfile will be by email address 
   * email adress being the common key between the two collections
   * 
   * 
   */
}
