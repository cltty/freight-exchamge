import { StringMap } from "@angular/compiler/src/compiler_facade_interface";

export interface Load {
    cancelled: Boolean,
    rejected: Boolean,
    shipperDetails: {
        shipperId: string,
        shipperName: string,
        shipperPhoneNumber: string,
        shipperEmailAddress: string
    },
    booked: {
        isBooked: boolean,
        carrierId?: string,
        carrierCompanyLegalName?: string,
        carrierEmailAddress?: string,
        carrierPhoneNumber?: string
    },
    origin: {
        arrival: string,
        city: string,
        country: string,
        zipcode: string
    }
    destination: {
        arrival: string,
        city: string,
        country: string,
        zipcode: string
    },
    equipment: {
        equipment: string,
        isRequired: boolean
    },
    payout: number,
    distance: number,
    _id: string
}