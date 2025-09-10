

export interface RawMaterial {
    RawMaterialID: number,
    RawMaterial: string,
    Quantity: number,
    Weight: number,
    MinimumQuantity: number,
    MinimumWeight: number,
    Category: string, 
    UserID: string
}


export interface Uom {
    BinloadUomID: number,
    BinloadUom: string
}