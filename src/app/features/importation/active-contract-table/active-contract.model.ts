







export interface ActiveContractList {
    ContractPerformaID: number
    ContractNo: string
    Quantity: number
    EstimatedContainer: number
    Served_Container: number
    Balance_Container: number
    Packaging: number
    PackedInID: number
    PackedIn: string
    RawMaterialID: number
    RawMaterial: string
    SupplierID: number
    Supplier: string
    SupplierAddress: string
    PortOfDischargeID: number
    PortOfDischarge: string
    FromShipmentPeriod: DateObject
    ToShipmentPeriod: DateObject
    CountryOfOrigin: string
    UnitPrice: number
    Status: string
    UserID: string
    created_at: DateObject
}
  
export interface FromShipmentPeriod {
    date: string
    timezone_type: number
    timezone: string
}
  
export interface ToShipmentPeriod {
    date: string
    timezone_type: number
    timezone: string
}

export interface DateObject {
    date: string
    timezone_type: number
    timezone: string
}
  