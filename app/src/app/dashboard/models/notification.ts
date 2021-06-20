export interface Notification {
    read: boolean,
    for: {
        userId: string,
        companyLegalName: string,
        companyEmailAddress: string,
        companyPhoneNumber: string
    },
    from: {
        userId: string,
        companyLegalName: string,
        companyEmailAddress: string,
        companyPhoneNumber: string
    },
    messageSummary: string,
    message: string
}