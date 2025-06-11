import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { weighingTransactionService } from "./weighing.service";
import { Observable, Subscription } from "rxjs";
import { MessageService } from "primeng/api";
import { DriverService } from "../pages/driver/driver.service";
import { CheckerService } from "../checker/checker.service";
import { CustomerService } from "../cutomer/customer.service";
import { RawMaterialsService } from "../raw-materials/raw-materials.service";
import { FinishProductService } from "../finish-product/finish-product.service";
import { TruckService } from "../pages/truck/truck.service";
import { SupplierService } from "../pages/supplier/supplier.service";
import { ShippingLineService } from "../pages/shipping-line/shipping-line.service";


@Component({
    selector: 'app-weighting-transaction',
    templateUrl: 'weighing-transaction.component.html',
    styleUrls: ['weighing-transaction.component.css']
})
export class WeighingTransactionComponent implements OnInit, OnDestroy{


    weighingTransaction: any[] = [];

    WeighingDetails: any[] = [];

    weighingTransactionForm!: FormGroup;

    rawMaterialForm!: FormGroup;

    finishProductForm!: FormGroup;

    visible: boolean = false;

    dialogHeader?: string;

    isLoading: boolean = false;

    truck: any[] = [];

    driver: any[] = [];

    checker: any[] = [];

    supplier: any[] = [];

    customer: any[] = [];

    isTransaction: any[] = [];

    rawMaterial: any[] = [];

    finishProduct: any[] = [];

    shippingLine: any[] = [];

    weigher: any[] = [];

    selectedTransaction!: string;

    grossWeight: number = 0;

    tareWeight: number = 0;

    netWeight?: number = 0;

    rmGrossWeight: number = 0;

    rmTareWeight: number = 0;

    rmNetWeight?: number = 0;

    lossAndOver?: number = 0;

    selectedForm!: FormGroup;

    stateOptions: any[] = [{ label: 'Raw Material', value: 1 },{ label: 'Finish Product', value: 2}];

    value: number = 1;

    private subscription: Subscription = new Subscription();

    constructor(
        private WeighingTransactionService: weighingTransactionService,
        private MessageService: MessageService,
        private TruckService: TruckService,
        private DriverService: DriverService,
        private CheckerService: CheckerService,
        private SupplierService: SupplierService,
        private CustomerService: CustomerService,
        private RawMaterialsService: RawMaterialsService,
        private FinishProductService: FinishProductService,
        private ShippingLineService: ShippingLineService
    ) {}

    ngOnInit(): void {

        this.isTransaction = [
            {isTransactionID: 1, Transaction: 'Raw Material'},
            {isTransactionID: 2, Transaction: 'Finish Product'},
            {isTransactionID: 3, Transaction: 'Others'},
            {isTransactionID: 4, Transaction: 'Backlog'},
            {isTransactionID: 5, Transaction: 'Pickup'},
        ]

        this.weighingTransactionForm = new FormGroup({
            'WeighingTransactionID': new FormControl(0),
            'RawMaterialID': new FormControl(null, Validators.required),
            'TruckID': new FormControl(null),
            'DriverID': new FormControl(null),
            'CheckerID': new FormControl(null), 
            'WeigherID': new FormControl(null),
            'SupplierID': new FormControl(null), 
            'CustomerID': new FormControl(null),
            'DrNumber': new FormControl(null),
            'GrossWeight': new FormControl(null),
            'TareWeight': new FormControl(null),
            'NetWeight': new FormControl(null),
            'rmGrossWeight': new FormControl(null),
            'rmTareWeight': new FormControl(null),
            'rmNetWeight': new FormControl(null),
            'LossOverWeight': new FormControl(null),
            'ShippingID': new FormControl(null),
            'DateTimeArrived': new FormControl(null),
            'WeighInDate': new FormControl(null),
            'WeighOutDate': new FormControl(null),
            'Others': new FormControl(null),
            'NoOfBags': new FormControl(null),
            'isTransaction': new FormControl(null),
            'WeighingTransDetialID': new FormControl(null),
            'Remarks':  new FormControl(null),
        })

        this.getData();
        this.getTruck();
        this.getDriver();
        this.getChecker();
        this.getSupplier();
        this.getCustomer();
        this.getRawMaterials();
        this.getFinishProduct();
        this.getShippingLine();
        this.getWeigher();
    }

    getData() {
        this.isLoading = true;
        this.subscription.add(
            this.WeighingTransactionService.getWeighingTrans(this.value).subscribe(
                response => {
                    this.weighingTransaction = response;
                    this.isLoading = false;
                }
            )
        )
    }

    getTruck() {
        this.subscription.add(
            this.TruckService.GetTruckData().subscribe(
                response => {
                    this.truck = response;
                }
            )
        )
    }

    getDriver() {
        this.subscription.add(
            this.DriverService.getDriverData().subscribe(
                response => {
                    this.driver = response;
                }
            )
        )
    }

    getChecker() {
        this.subscription.add(
            this.CheckerService.getCheckerData().subscribe(
                response => {
                    this.checker = response;
                }
            )
        )
    }

    getSupplier() {
        this.subscription.add(
            this.SupplierService.getSupplierData().subscribe(
                response => {
                    this.supplier = response;
                }
            )
        )
    }

    getCustomer() {
        this.subscription.add(
            this.CustomerService.getCustomerData().subscribe(
                response => {
                    this.customer = response;
                }
            )
        )
    }

    getRawMaterials() {
        this.subscription.add(
            this.RawMaterialsService.getRawMatsData().subscribe(
                response => {
                    this.rawMaterial = response;
                }
            )
        )
    }

    getFinishProduct() {
        this.subscription.add(
            this.FinishProductService.getFinishProductData().subscribe(
                response => {
                    this.finishProduct = response;
                }
            )
        )
    }

    getShippingLine() {
        this.subscription.add(
            this.ShippingLineService.getShippingLineData().subscribe(
                response => {
                    this.shippingLine = response;
                }
            )
        )
    }

    getWeigher() {
        this.subscription.add(
            this.WeighingTransactionService.getWeigher().subscribe(
                response => {
                    this.weigher = response;
                }
            )
        )
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    showDialog() {
        this.visible = true;
        this.dialogHeader = 'Add Weighing Transaction';
        this.clearItems();
        this.addRow();
    }

    clearItems() {
        this.weighingTransactionForm.reset();
        this.weighingTransactionForm.patchValue({WeighingTransactionID: 0});
        this.WeighingDetails = [];
    }

    addRow() {
        let data = {
            FinishProductID: 0,
            NoOfBags: 0
        }

        this.WeighingDetails.push(data);    
    }

    removeOrder(index: number) {
        this.WeighingDetails.splice(index, 1)
    }

    computeTotalQuantity() {
        // console.log(this.WeighingTransactionDetails);
        let totalQuantity = 0;

        for (let i = 0; i <= this.WeighingDetails.length -1; i++) {
            totalQuantity += this.WeighingDetails[i].FinishProductID.KiloPerBag * this.WeighingDetails[i].NoOfBags;
        }

        this.weighingTransactionForm.get('NoOfBags')?.setValue(totalQuantity);
    }

    onSubmit() {
        // console.log(this.weighingTransactionForm.value.RawMaterialID)
        let authObs: Observable<ResponseData>;
        authObs = this.WeighingTransactionService.saveData
        (
            this.weighingTransactionForm.value.WeighingTransactionID, 
            this.weighingTransactionForm.value.RawMaterialID === null ? 0 : this.weighingTransactionForm.value.RawMaterialID.RawMaterialID, 
            this.weighingTransactionForm.value.TruckID.TruckID ? this.weighingTransactionForm.value.TruckID.TruckID : 0, 
            this.weighingTransactionForm.value.DriverID.DriverID ?  this.weighingTransactionForm.value.DriverID.DriverID : 0, 
            this.weighingTransactionForm.value.CheckerID.CheckerID ? this.weighingTransactionForm.value.CheckerID.CheckerID : 0, 
            this.weighingTransactionForm.value.WeigherID.WeigherID ?  this.weighingTransactionForm.value.WeigherID.WeigherID :  0, 
            this.weighingTransactionForm.value.SupplierID === null ? 0 : this.weighingTransactionForm.value.SupplierID.SupplierID,  
            this.weighingTransactionForm.value.CustomerID === null ? 0 : this.weighingTransactionForm.value.CustomerID.CustomerID, 
            this.weighingTransactionForm.value.DrNumber, 
            this.weighingTransactionForm.value.GrossWeight, 
            this.weighingTransactionForm.value.TareWeight,
            this.weighingTransactionForm.value.NetWeight,
            this.weighingTransactionForm.value.rmGrossWeight,
            this.weighingTransactionForm.value.rmTareWeight,
            this.weighingTransactionForm.value.rmNetWeight,
            this.weighingTransactionForm.value.LossOverWeight,
            this.weighingTransactionForm.value.ShippingID === null ? 0 :  this.weighingTransactionForm.value.ShippingID.ShippingLineID,
            this.weighingTransactionForm.value.DateTimeArrived.toLocaleDateString(),
            this.weighingTransactionForm.value.WeighInDate.toLocaleDateString(),
            this.weighingTransactionForm.value.WeighOutDate.toLocaleDateString(),
            this.weighingTransactionForm.value.Others === null ? '' : this.weighingTransactionForm.value.Others,
            this.weighingTransactionForm.value.NoOfBags ? this.weighingTransactionForm.value.NoOfBags : 0,
            this.weighingTransactionForm.value.isTransaction,
            this.weighingTransactionForm.value.Remarks,
            this.weighingTransactionForm.value.WeighingTransDetialID === null ? 0 : this.weighingTransactionForm.value.WeighingTransDetialID,
            this.WeighingDetails
        )

        authObs.subscribe(response =>{

            if( response === 1) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.weighingTransactionForm.value.WeighingTransactionID +  ' successfully recorded', life: 3000 });
                this.getData();
                this.clearItems();
            } 
            else if ( response === 2) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.weighingTransactionForm.value.WeighingTransactionID +  ' successfully updated', life: 3000 });
                this.getData();
                this.clearItems();
            }
            else if ( response === 0) {
                this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.weighingTransactionForm.value.WeighingTransactionID +  ' already exist', life: 3000 });
            }
            
        }, errorMessage => {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        })
    }

    findObjectByID( selectedID: number, idName: string, array: any[]) {
        for (let i = 0; i <= array.length -1; i++) {
            if (selectedID === array[i][idName]) {
                return array[i];
            }
        }
        return null; 
    }

    onSelect(data: any) {
        this.showDialog();
        this.dialogHeader = 'Edit Weighing Transaction';
        this.WeighingDetails = [];

        for (let i = 0; i <= this.isTransaction.length -1; i++) {
            if (data.isTransaction == this.isTransaction[i].isTransactionID) {
                this.onSelectIsTransaction(this.isTransaction[i]);
            }
        } 

        this.WeighingTransactionService.getWeighingTransDetails(data.WeighingTransactionID).subscribe(
            response => {  
                
                let WeighingDetailResponse = response;

                // console.log(WeighingDetailResponse);

                if (WeighingDetailResponse[0].isTransaction == 1) {
                    let RawMaterialValue = this.findObjectByID(WeighingDetailResponse[0].RawMaterialID, 'RawMaterialID', this.rawMaterial);

                    this.weighingTransactionForm.patchValue({
                        RawMaterialID: RawMaterialValue,
                        WeighingTransDetialID: WeighingDetailResponse[0].WeighingTransDetialID
                    })
                }

                else if (WeighingDetailResponse[0].isTransaction == 2){
                    for (let i = 0; i <= WeighingDetailResponse.length -1; i++) {

                        let FinishProductValue = this.findObjectByID(WeighingDetailResponse[i].FinishProductID, 'FinishProductID', this.finishProduct);

                        let data = {
                            WeighingTransactionID: WeighingDetailResponse[i].WeighingTransactionID,
                            FinishProductID: FinishProductValue,
                            NoOfBags: WeighingDetailResponse[i].NoOfBags
                        }

                        this.WeighingDetails.push(data);
                    }
                }

                console.log(this.weighingTransactionForm.value);

                // for (let i = 0; i <= WeighingDetailResponse.length -1; i++) {

                //     let FinishProductValue = this.findObjectByID(WeighingDetailResponse[i].FinishProductID, 'FinishProductID', this.finishProduct);

                //     let data = {
                //         WeighingTransactionID: WeighingDetailResponse[i].WeighingTransactionID,
                //         FinishProductID: FinishProductValue,
                //         NoOfBags: WeighingDetailResponse[i].NoOfBags
                //     }

                //     this.WeighingDetails.push(data);
                // }
            }
        )

        let TruckValue = this.findObjectByID(data.TruckID, 'TruckID', this.truck);

        let DriverValue = this.findObjectByID(data.DriverID, 'DriverID', this.driver);

        let CheckerValue = this.findObjectByID(data.CheckerID, 'CheckerID', this.checker);

        let WeigherValue = this.findObjectByID(data.WeigherID, 'WeigherID', this.weigher);

        let SupplierValue = {};

        for(let i = 0; i <= this.supplier.length -1 ; i++) {
            if (this.supplier[i].SupplierID == data.SupplierID) {
                SupplierValue = this.supplier[i];
                break;
            } else {
                SupplierValue = 0;
            }
        }

        let CustomerValue = {};

        for(let i = 0; i <= this.customer.length -1 ; i++) {
            if (this.customer[i].CustomerID == data.CustomerID) {
                CustomerValue = this.customer[i];
                break;
            } else {
                CustomerValue = 0;
            }
        }


        let IsTransactionValue = {};
        for (let i = 0; i <= this.isTransaction.length -1; i++) {
            if(data.isTransaction == this.isTransaction[i].isTransactionID) {
                IsTransactionValue = this.isTransaction[i];
                break;
            }
        }

        let ShippingLineValue = {};
        for (let i = 0; i <= this.shippingLine.length -1; i++) {
            if (data.ShippingID === this.shippingLine[i].ShippingLineID) {
                ShippingLineValue = this.shippingLine[i];
                break
            } else {
                ShippingLineValue = 0;
            }
        }

        this.weighingTransactionForm.setValue({
            WeighingTransactionID: data.WeighingTransactionID,
            RawMaterialID: 0,
            TruckID: TruckValue,
            DriverID: DriverValue,
            CheckerID: CheckerValue,
            WeigherID: WeigherValue,
            SupplierID: SupplierValue,
            CustomerID: CustomerValue,
            DrNumber: data.DrNumber,
            GrossWeight: data.GrossWeight,
            TareWeight: data.TareWeight,
            NetWeight: data.NetWeight,
            rmGrossWeight: data.rmGrossWeight,
            rmTareWeight: data.rmTareWeight,
            rmNetWeight: data.rmNetWeight,
            LossOverWeight: data.LossOverWeight,
            ShippingID: ShippingLineValue,
            DateTimeArrived: new Date(data.DateTimeArrived.date) ,
            WeighInDate: new Date (data.WeighInDate.date), 
            WeighOutDate: new Date (data.WeighOutDate.date),
            Others: data.Others,
            NoOfBags: data.NoOfBags,
            isTransaction: IsTransactionValue,
            Remarks: data.Remarks,
            WeighingTransDetialID: 0
        })

    }

    onDelete(id: any) {
        this.WeighingTransactionService.onDeleteData(id).subscribe(
            response => {
                if (response === 3 ) {
                     this.MessageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
                //  this.getData();
                }
            } 
        )
    }

    onSelectIsTransaction(data: any) {
        if (data == null) {
            this.selectedTransaction = '';
            return
        }
        
        // this.clearItems();
        this.selectedTransaction = data.Transaction;   
    }

    getGrossWeight(data: number) {
        this.grossWeight = data;
        
        this.netWeight = this.computeNetWeight(this.grossWeight, this.tareWeight);
        
        this.weighingTransactionForm.get('NetWeight')?.setValue(this.netWeight);
        this.computeLossAndOver();
    }

    getTareWeight(data: number) {
        this.tareWeight = data;
        
        this.netWeight = this.computeNetWeight(this.grossWeight, this.tareWeight);

        this.weighingTransactionForm.get('NetWeight')?.setValue(this.netWeight);
        this.computeLossAndOver();
    }

    computeNetWeight(grossWeight: number, tareWeight: number) {
        if (grossWeight === 0 || tareWeight === 0) return;

        return grossWeight - tareWeight;
    }

    computeLossAndOver() {
        if (this.selectedTransaction == 'Raw Material') {
            if (!this.netWeight || !this.rmNetWeight) return
            this.lossAndOver = this.netWeight - this.rmNetWeight;
    
            this.weighingTransactionForm.get('LossOverWeight')?.setValue(this.lossAndOver);
        }
        else if (this.selectedTransaction == 'Finish Product') {
            if (!this.weighingTransactionForm.value.NoOfBags || !this.netWeight) return
            this.lossAndOver = this.weighingTransactionForm.value.NoOfBags - this.netWeight
            this.weighingTransactionForm.get('LossOverWeight')?.setValue(this.lossAndOver);
        }

    }

    getRmGrossWeight(data: number) {
        this.rmGrossWeight = data;

        this.rmNetWeight = this.computeNetWeight(this.rmGrossWeight, this.rmTareWeight)

        this.weighingTransactionForm.get('rmNetWeight')?.setValue(this.rmNetWeight);
        this.computeLossAndOver();
    }

    getRmTareWeight(data: number) {
        this.rmTareWeight = data;

        this.rmNetWeight = this.computeNetWeight(this.rmGrossWeight, this.rmTareWeight)

        this.weighingTransactionForm.get('rmNetWeight')?.setValue(this.rmNetWeight);
        this.computeLossAndOver();
    }

    onSelectFilter() {
        this.getData();
    }

}

interface ResponseData {

}