







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
    FromShipmentPeriod: FromShipmentPeriod
    ToShipmentPeriod: ToShipmentPeriod
    CountryOfOrigin: string
    UnitPrice: number
    Status: string
    UserID: string
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
  