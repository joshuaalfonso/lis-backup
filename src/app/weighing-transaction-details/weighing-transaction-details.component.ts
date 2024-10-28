import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { WeighingTransactionDetailsService } from "./weighing-transaction-details.service";
import { Observable, Subscription } from "rxjs";
import { MessageService } from "primeng/api";
import { FinishProductService } from "../finish-product/finish-product.service";
import { RawMaterialsService } from "../raw-materials/raw-materials.service";
import { CustomerService } from "../cutomer/customer.service";




@Component({
    selector: 'app-weighing-transaction-detials',
    templateUrl: 'weighing-transaction-details.component.html',
    styleUrls: ['weighing-transaction-details.component.css']
})
export class WeighingTransactionDetailsComponent implements OnInit{

    weighingTransactionDetail: any[] = [];

    weighingTransactionDetailForm!: FormGroup;

    finishProduct: any[] = [];

    rawMaterials: any[] = [];

    customer: any[] = [];

    visible: boolean = false;

    dialogHeader?: string;

    private subscription: Subscription = new Subscription();

    constructor(
        private WeighingTransactionDetailService: WeighingTransactionDetailsService,
        private MessageService: MessageService,
        private FinishProductService: FinishProductService,
        private RawMaterialsService: RawMaterialsService,
        private CustomerService: CustomerService
    ) {}

    ngOnInit(): void {
        this.weighingTransactionDetailForm = new FormGroup({
            'WeighingTransDetailID': new FormControl(0),
            'weighingTransactionID': new FormControl(null, Validators.required),
            'FinishProductID': new FormControl(null, Validators.required),
            'RawMaterialID': new FormControl(null, Validators.required),
            'CustomerID': new FormControl(null, Validators.required),
            'NoOfBags': new FormControl(null, Validators.required),
            'isTransaction': new FormControl(null, Validators.required)
        })
        
    this.getData();
    }

    getData() {
        this.subscription.add(
            this.WeighingTransactionDetailService.getWeighingTransDetialData().subscribe(
                response => {
                    this.weighingTransactionDetail = response;
                }
            )
        )

        this.subscription.add(
            this.FinishProductService.getFinishProductData().subscribe(
                response => {
                    this.finishProduct = response;
                }
            )
        )

        this.subscription.add(
            this.RawMaterialsService.getRawMatsData().subscribe(
                response => {
                    this.rawMaterials = response;
                }
            )
        )

        this.subscription.add(
            this.CustomerService.getCustomerData().subscribe(
                response => {
                    this.customer = response;
                }
            )
        )
    }

    showDialog() {
        this.visible = true;
        this.dialogHeader = 'Add Weighing Transaction Detail';
    }

    clearItems() {
        this.weighingTransactionDetailForm.reset();
        this.weighingTransactionDetailForm.patchValue({WeighingTransDetailID: 0})
    }

    onSubmit() {
        let authObs: Observable<ResponseData>;
        authObs = this.WeighingTransactionDetailService.saveData
        (
            this.weighingTransactionDetailForm.value.WeighingTransDetailID,
            this.weighingTransactionDetailForm.value.weighingTransactionID,
            this.weighingTransactionDetailForm.value.FinishProductID.FinishProductID,
            this.weighingTransactionDetailForm.value.RawMaterialID.RawMaterialID,
            this.weighingTransactionDetailForm.value.CustomerID.CustomerID,
            this.weighingTransactionDetailForm.value.NoOfBags,
            this.weighingTransactionDetailForm.value.isTransaction,
        )

        authObs.subscribe(response =>{

            if( response === 1) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.weighingTransactionDetailForm.value.weighingTransactionID +  ' successfully recorded', life: 3000 });
                this.getData();
                this.clearItems();
            } 
            else if ( response === 2) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.weighingTransactionDetailForm.value.weighingTransactionID +  ' successfully updated', life: 3000 });
                this.getData();
                this.clearItems();
            }
            else if ( response === 0) {
                this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.weighingTransactionDetailForm.value.weighingTransactionID +  ' already exist', life: 3000 });
            }
            
        }, errorMessage => {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        })
    }

    onSelect(data: any) {
        this.showDialog();
        this.dialogHeader = 'Edit Weighing Transaction Detail';

        let FinishProductValue = {};

        for (let i = 0; i <= this.finishProduct.length -1; i++) {
            if (this.finishProduct[i].FinishProductID == data.FinishProductID) {
                FinishProductValue = this.finishProduct[i];
                break;
            }
        }

        let RawMaterialValue = {};

        for (let i = 0; i <= this.rawMaterials.length -1; i++) {
            if (this.rawMaterials[i].RawMaterialID == data.RawMaterialID) {
                RawMaterialValue = this.rawMaterials[i];
                break;
            }
        }

        let CustomerID = {};

        for (let i = 0; i <= this.customer.length -1; i++) {
            if (this.customer[i].CustomerID == data.CustomerID) {
                CustomerID = this.customer[i];
                break;
            }
        }

        this.weighingTransactionDetailForm.setValue({
            WeighingTransDetailID: data.WeighingTransDetialID,
            weighingTransactionID: data.WeighingTransactionID,
            FinishProductID: FinishProductValue,
            RawMaterialID: RawMaterialValue,
            CustomerID: CustomerID,
            NoOfBags: data.NoofBags,
            isTransaction: data.isTransaction
        })
    }

}

interface ResponseData {

}