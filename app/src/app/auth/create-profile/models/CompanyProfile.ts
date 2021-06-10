import { CompanyDetails } from "./CompanyDetails";
import { Equipment } from "./Equipment";
import { PaymentDetails } from "./PaymentDetails";

export interface CompanyProfile {
    userId?: string;
    emailAddress: string;
    companyDetails: CompanyDetails;
    paymentDetails: PaymentDetails;
    equipment?: Equipment;
    insuranceDocuments?: any[],
    operatinLicense?: any
}