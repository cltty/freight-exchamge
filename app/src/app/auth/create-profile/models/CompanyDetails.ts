export interface CompanyDetails {
    companyLegalName: string,
    companyType: string,
    vatNumber: string,
    state: string,
    city: string,
    addressLine1: string,
    addressLine2?: string,
    phoneNumber: string,
    postcode: string,
    domiciles: string,
    countryName: string,
}