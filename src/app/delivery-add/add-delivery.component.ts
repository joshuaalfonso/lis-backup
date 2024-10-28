import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomerService } from "../cutomer/customer.service";
import { Observable, Subscription } from "rxjs";
import { FinishProductService } from "../finish-product/finish-product.service";
import { AddDeliveryService } from "./add-delivery.service";
import { WarehousePartitionService } from "../warehouse-partition/warehouse-partition.service";
import { MessageService } from "primeng/api";


@Component({
    selector: 'add-delivery-app',
    templateUrl: 'add-delivery.component.html',
    styleUrls: ['add-delivery.component.css']
})

export class AddDeliveryComponent implements OnInit{

    deliveryForm!: FormGroup;

    customer: any[] = [];
    DeliveryDetail : any[] = [];
    finishProduct: any[] = [];
    warehousePartitionStock: any[] = [];
    warehousePartition: any[] = [];
    selectedOrderIndex!: number;
    messages!: Message[] ;


    visible: boolean = false;

    totalQuantity!: number;

    private subscription: Subscription = new Subscription();

    constructor(
        private AddDeliveryService: AddDeliveryService,
        private CustomerService: CustomerService,
        private FinishProductService: FinishProductService,
        private WarehousePartitionService: WarehousePartitionService,
        private MessageService: MessageService
    ) {}


    ngOnInit(): void { 
        this.deliveryForm = new FormGroup({
            'DeliveryID': new FormControl(0),
            'DeliveryNo': new FormControl(null, Validators.required),
            'PurchaseOrderNo': new FormControl(null, Validators.required),
            'KiloPerBag': new FormControl(0),
            'DeliveryDate': new FormControl(null, Validators.required),
            'CustomerID': new FormControl(null, Validators.required),
            'TotalQty': new FormControl(null, Validators.required),
            'UserID': new FormControl(0)
        })

        this.getData();
        this.addDelivery();

        this.messages = [
            { severity: 'error', summary: 'Error', detail: 'Message Content' }
        ];
    }

    getData() {
        this.subscription.add(
            this.CustomerService.getCustomerData().subscribe(
                response => {
                    this.customer = response;
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
            this.WarehousePartitionService.getWarehousePartitionData().subscribe(
                response => {
                    this.warehousePartition = response;
                }
            )
        )
    }

    onSubmit() {
        let authObs: Observable<ResponseData>;
        authObs = this.AddDeliveryService.saveData
        (
            this.deliveryForm.value.DeliveryID,
            this.deliveryForm.value.DeliveryNo,
            this.deliveryForm.value.PurchaseOrderNo,
            this.deliveryForm.value.DeliveryDate.toLocaleDateString(),
            this.deliveryForm.value.CustomerID.CustomerID,
            this.totalQuantity,
            this.DeliveryDetail ,
            this.deliveryForm.value.UserID
        )

        authObs.subscribe(response =>{

            if( response === 1) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.deliveryForm.value.DeliveryNo +  ' successfully recorded', life: 3000 });
                this.getData();
                // this.clearForm();
            } 
            else if ( response === 2) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.deliveryForm.value.DeliveryNo +  ' successfully updated', life: 3000 });
                this.getData();
                // this.clearForm();
            }
            else if ( response === 0) {
                this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.deliveryForm.value.DeliveryNo +  ' already exist', life: 3000 });
            }
            
        }, errorMessage => {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        })

    }

    onSelect(data: any) {

        let warehousePartitionValue = {};

        for (let i = 0; i <= this.warehousePartition.length; i++) {
            if (this.warehousePartition[i].WarehousePartitionID == data.WarehousePartitionID) {
                warehousePartitionValue = this.warehousePartition[i]
                break
            }
        }

        if(this.selectedOrderIndex != undefined) {
            this.DeliveryDetail[this.selectedOrderIndex].Quantity = data.FinProdQty;
            this.DeliveryDetail[this.selectedOrderIndex].MaxInputQuantity = data.FinProdQty;
            this.DeliveryDetail[this.selectedOrderIndex].WarehousePartitionID = warehousePartitionValue;
            this.DeliveryDetail[this.selectedOrderIndex].StockingDate = new Date(data.StockingDate.date).toLocaleDateString()

            this.ComputeTotalQuantity();
        }

        // console.log(this.DeliveryDetail)
    }

    addDelivery(){
        let data = {
          DeliveryDetailID: 0,
          WarehousePartitionID: 0,
          FinishProductID: 0,
          Quantity: 0,
        };

        this.DeliveryDetail.push(data);
    }

    removeOrder(i: any) {
        this.DeliveryDetail.splice(i, 1);
        this.ComputeTotalQuantity();
    }

    showDialog() {
        this.visible = !this.visible;
    }

    onSelectFinishProduct(index: any) {
        this.visible = true;
        this.selectedOrderIndex = index;
        let FinishProductID = this.DeliveryDetail[index].FinishProductID.FinishProductID;

        this.AddDeliveryService.getWarehousePartitionStock(FinishProductID).subscribe(
            response => {
                this.warehousePartitionStock = response
            }
        )
        
    }   

    ComputeTotalQuantity() {
        this.totalQuantity = 0;

        for (let i = 0; i <= this.DeliveryDetail.length -1; i++) {

            if (this.DeliveryDetail[i].FinishProductID == 0) 
            return;

            this.totalQuantity = this.totalQuantity + this.DeliveryDetail[i].Quantity;

        }
    }


}

interface ResponseData {

}
interface Message {

}