


export interface ContractPost {
    ContractPerformaID: number,
    ContractNo: string,
    Quantity: number,
    EstimatedContainer: string,
    Packaging: number,
    PackedInID: number,
    RawMaterialID: number,
    SupplierID: number,
    SupplierAddress: string,
    PortOfDischargeID: string,
    FromShipmentPeriod: string,
    ToShipmentPeriod: string,
    CountryOfOrigin: string,
    Status: string,
    UserID: string
}



export interface ShippingPost {
    ShippingTransactionID: number,
    ContractPerformaID: number,
    Lot: string | null,
    // Served: number,
    // Balance: number,
    RawMaterialID: number,
    SupplierID: number,
    Packaging: number,
    AdvanceDocumentsReceived: string | null,
    BAI_SPS_IC: string | null,
    FromBAIValidity: string | null,
    ToBAIValidity: string | null,
    BPI_SPS_IC: string | null,
    FromBPIValidity: string | null,
    ToBPIValidity: string | null,
    MBL: string | null,
    BL: string | null,
    ShippingLineID: number | null,
    Vessel: number | null,
    HBL: string | null,
    Forwarder: string | null,
    ETD: string | null,
    ETA: string | null,
    ATA: string | null,
    ContainerTypeID: number | null,
    NoOfContainer: number | null,
    NoOfTruck: number | null,
    Quantity: number | null, 
    BrokerID: number | null,
    DateDocsReceivedByBroker: string | null,
    BAI_SPS_IC_Date: string | null,
    BPI_SPS_IC_Date: string | null,
    OriginalDocsAvailavilityDate: string | null,
    BankID: number | null,
    DateOfPickup: string | null,
    PortOfDischarge: string | null,
    Status: number | null,
    DateOfDischarge: string | null,
    LodgementDate: string | null,
    LodgementBankID: number | null,
    GatepassRecieved: string | null,
    AcknowledgeByLogistics: string | null,
    StorageLastFreeDate: string | null,
    DemurrageDate: string | null,
    DetentionDate: string | null,
    Remarks: string | null,
    UserID: string
}


export interface PullOutPost {
    MBL: String,
    HBL: String,
    UserID: string,
    PullOutDetail: any[]
}