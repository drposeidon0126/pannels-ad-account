export type AccoutStatus = 'Paid' | string

export type InvoiceLayoutProps = {
  id: string | undefined
}

// export type InvoiceClientType = {
//   name: string
//   address: string
//   company: string
//   country: string
//   contact: string
//   companyEmail: string
// }

export type AccoutType = {
  id: number
  name: string
  platform: string
  timezone: string
  currency: string
  link: string
  status: AccoutStatus
}

// export type InvoicePaymentType = {
//   iban: string
//   totalDue: string
//   bankName: string
//   country: string
//   swiftCode: string
// }

// export type SingleInvoiceType = {
//   invoice: InvoiceType
//   paymentDetails: InvoicePaymentType
// }
