import { Component, OnDestroy, OnInit } from "@angular/core";
import { DeliveryDetailService } from "./delivery-details.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { MessageService } from "primeng/api";
import { Table } from "primeng/table";
import { DeliveryService } from "../delivery/delivery.service";
import { FinishProductService } from "../finish-product/finish-product.service";


@Component({
    selector: 'app-delivery-detail',
    templateUrl: 'delivery-detail.component.html',
    styleUrls: ['delivery-detail.component.css']
})
export class DeliveryDetailComponent implements OnInit, OnDestroy{

    deliveryDetail: any[] = [];

    deliverDetailForm!: FormGroup;

    delivery: any[] = [];

    finishProduct: any[] = [];

    visible: boolean = false;

    isLoading: boolean = false;

    dialogHeader?: string;

    private subscription: Subscription = new Subscription();

    constructor(
        private DeliveryDetailService: DeliveryDetailService,
        private MessageService: MessageService,
        private DeliveryService: DeliveryService,
        private FinishProductService: FinishProductService
    ) {}

    ngOnInit(): void {
        this.deliverDetailForm = new FormGroup({
            'DeliveryDetailID': new FormControl(0),
            'DeliveryID': new FormControl(null, Validators.required),
            'FinishProductID': new FormControl(null, Validators.required),
            'Quantity': new FormControl(null, Validators.required)
        })

        this.getData();
    }

    getData() { 
        this.isLoading = true;

        this.subscription.add(
            this.DeliveryDetailService.getDeliveryDetailData().subscribe(
                response => {
                    this.deliveryDetail = response;
                    this.isLoading = false;
                    // console.log(response);
                }
            )
        )

        this.subscription.add(
            this.DeliveryService.getDeliveryData().subscribe(
                response => {
                    this.delivery = response;
                    // console.log(response);
                }
            )
        )

        this.subscription.add(
            this.FinishProductService.getFinishProductData().subscribe(
                response => {
                    this.finishProduct = response;
                    // console.log(response);
                }
            )
        )
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    showDialog() {
        this.visible = true;
        this.dialogHeader = 'Add Delivery Detail';
        this.clearForm();
    }

    clearForm() {
        this.deliverDetailForm.reset();
        this.deliverDetailForm.patchValue({DeliveryDetailID: 0})
    }

    onSubmit() {
        let authObs: Observable<ResponseData>;
        authObs = this.DeliveryDetailService.saveData
        (
            this.deliverDetailForm.value.DeliveryDetailID,
            this.deliverDetailForm.value.DeliveryID.DeliveryID,
            this.deliverDetailForm.value.FinishProductID.FinishProductID,
            this.deliverDetailForm.value.Quantity
        ) 

        authObs.subscribe(response =>{

            if( response === 1) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.deliverDetailForm.value.DeliveryID.DeliveryNo +  ' successfully recorded', life: 3000 });
                this.getData();
                this.clearForm();
            } 
            else if ( response === 2) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.deliverDetailForm.value.DeliveryID.DeliveryNo +  ' successfully updated', life: 3000 });
                this.getData();
                this.clearForm();
            }
            else if ( response === 0) {
                this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.deliverDetailForm.value.DeliveryID.DeliveryNo +  ' already exist', life: 3000 });
            }
            
        }, errorMessage => {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        })
    }

    onSelect(data: any) {
        this.showDialog();
        this.dialogHeader = 'Edit Delivery Detail';

        let deliveryNoValue = {};

        for (let i = 0; i <= this.delivery.length -1; i++) {
            if (this.delivery[i].deliveryID === data.deliveryID) {
                deliveryNoValue = this.delivery[i];
                break;
            }
        }

        let finishProductValue = {};

        for (let i = 0; i <= this.finishProduct.length -1; i++) {
            if (this.finishProduct[i].FinishProductID === data.FinishProductID) {
                finishProductValue = this.finishProduct[i];
                break;
            }
        }

        this.deliverDetailForm.setValue({
            DeliveryDetailID: data.DeliveryDetailID,
            DeliveryID: deliveryNoValue,
            FinishProductID: finishProductValue,
            Quantity: data.Quantity
        })
    }

     // ==== INPUT SEARCH DATA====
     onGlobalFilter(table: Table, event: Event) {
        const inputValue = (event.target as HTMLInputElement).value;
        table.filterGlobal(inputValue, 'contains');
    }
}

interface ResponseData {

}