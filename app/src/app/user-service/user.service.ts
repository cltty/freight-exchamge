import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CompanyProfile } from '../auth/create-profile/models/CompanyProfile';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly ENV: string = 'http://localhost:3000/'; 
  private readonly CHECK_VAT_NUMBER: string = 'vat-check';
  private readonly CHECK_FILE_UPLOAD: string = 'documents/insurance';

  private readonly UPLOAD_INSURANCE_DOCUMENTS_URL: string = 'documents/insurance';
  private readonly UPLOAD_OPERATING_LICENSE_URL: string = 'documents/operating-license';
  private readonly CREATE_CARRIER_COMPANY_PROFILE: string = 'carrier';
  private readonly CREATE_SHIPPER_COMPANY_PROFILE: string = 'shipper';

  public toggleDefaultNavbar$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private httpClient: HttpClient) {}

  public getUserId() {
    return localStorage.getItem('userId');
  }

  public setUserId(userId: string) {
    localStorage.setItem('userId', userId);
  }

  public setCompanyType(companyType: string) {
    localStorage.setItem('companyType', companyType);
  }

  public getCompanyType() {
    return localStorage.getItem('companyType');
  }

  public createCarrierProfile(profilePayload: CompanyProfile) {
    return this.httpClient.post<any>(
      this.ENV + this.CREATE_CARRIER_COMPANY_PROFILE, {
        companyProfileObj: profilePayload,
        userId: this.getUserId()
      }
    );
  }

  public createShipperProfile(profilePayload: CompanyProfile) {
    return this.httpClient.post<any>(
      this.ENV + this.CREATE_SHIPPER_COMPANY_PROFILE, {
        companyProfileObj: profilePayload,
        userId: this.getUserId()
      }
    );
  }

  public checkVatNumber(vatObj: any) {
    return this.httpClient.post<any>(
      this.ENV + this.CHECK_VAT_NUMBER, {
        vatObj: vatObj
      }
    );
  }

  public checkFileUploadEndpoint(files: any) {
    return this.httpClient.post<any>(
      this.ENV + this.CHECK_FILE_UPLOAD, {
        files
      }
    );
  }

  public uploadInsuranceDocuments(files: any) {
    return this.httpClient.post<any>(
      this.ENV + this.UPLOAD_INSURANCE_DOCUMENTS_URL, {
        files
      }
    );
  }

  public uploadOperatingLicense(file: any) {
    return this.httpClient.post<any>(
      this.ENV + this.UPLOAD_OPERATING_LICENSE_URL, {
        file
      }
    );
  }

}
