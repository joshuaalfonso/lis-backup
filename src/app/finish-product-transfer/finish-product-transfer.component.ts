import { Component, OnDestroy, OnInit } from "@angular/core";
import { FinishProductTransferService } from "./finish-product-transfer.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { ConfirmationService, MessageService } from "primeng/api";
import { Table } from "primeng/table";
import { FinishProductService } from "../finish-product/finish-product.service";
import { WarehouseService } from "../warehouse/warehouse.service";
import { WarehousePartitionService } from "../warehouse-partition/warehouse-partition.service";
import { UsersService } from "../users/users.service";
import { AuthService } from "../auth/auth.service";



@Component({
    selector: 'app-finish-product-transfer',
    templateUrl: 'finish-product-transfer.component.html',
    styleUrls: ['finish-product-transfer.component.css']
})
export class FinishProductTrasfer implements OnInit, OnDestroy{

    transfer: any[] = [];

    warehouse: any[] = [];

    warehousePartition: any[] = [];

    selectedFromWarehouse: any[] = [];
    selectedToWarehouse: any[] = [];

    finishProduct: any[] = [];

    checker: any = [];

    transferForm!: FormGroup;

    visible: boolean = false;

    isLoading: boolean = false;

    view: boolean = false;
    insert: boolean = false;
    edit: boolean = false;
    generateReport: boolean = false;

    dialogHeader?: string;

    private subscription: Subscription = new Subscription();

    constructor(
        private FinishProductTransferService: FinishProductTransferService,
        private MessageService: MessageService,
        private ConfirmationService: ConfirmationService,
        private FinishProductService: FinishProductService,
        private WarehouseService: WarehouseService, 
        private WarehousePartitionService: WarehousePartitionService,
        private UsersService: UsersService,
        private auth: AuthService
    ) {}

    ngOnInit(): void {
        this.transferForm = new FormGroup({
            'FinishProductTransferID': new FormControl(0),
            'DateTransfer': new FormControl(null, Validators.required),
            'FromWarehouseID': new FormControl(null, Validators.required),
            'FromWarehousePartitionID': new FormControl(null, Validators.required),
            'ToWarehouseID': new FormControl(null, Validators.required),
            'ToWarehousePartitionID': new FormControl(null, Validators.required),
            'FinishProductID': new FormControl(null, Validators.required),
            'Quantity': new FormControl(null, Validators.required),
            'CheckerID': new FormControl(null, Validators.required),
            'UserID': new FormControl(0),
        })

        this.subscription.add(
            this.auth.user.subscribe(
                user => {
                    this.getUserAccess(user!.user_id);
                }
            )
        )

        this.getData();
        this.getWarehouse();
        this.getWarehousePartition();
        this.getChecker();
        this.getFinishProduct();
    }

    getUserAccess(UserID: string) {
        this.subscription.add(
            this.UsersService.getUserAccess(UserID).subscribe(
                response => {
                    let userRights = response;

                    for (let i = 0; i < userRights.length; i++) {
                        switch (userRights[i].AccessRight) {
                            case 26.1:
                                this.view = true;
                                break;
                            case 26.2:
                                this.insert = true;
                                break;
                            case 26.3:
                                this.edit = true;
                                break;
                            case 26.4:
                                this.generateReport = true;
                                break;
                            default:
                                break;
                        }
                    }
                    
                }
            )       
        )
    }



    getData() {
        this.isLoading = true;
        this.subscription.add(
            this.FinishProductTransferService.getTransferData().subscribe(
                response => {
                    this.transfer = response;
                    this.isLoading = false; 
                    // console.log(response)
                }
            )
        )

    }

    getWarehouse() {
        this.subscription.add(
            this.WarehouseService.getWarehouseData().subscribe(
                response => {
                    this.warehouse = response;
                    for (let i = 0; i <= this.warehouse.length -1; i++) {
                        this.warehouse[i] = {...this.warehouse[i], LocationName: `${this.warehouse[i].WarehouseLocation} - ${this.warehouse[i].Warehouse_Name}`}
                    }
                }
            )
        )

    }

    getWarehousePartition() {
        this.subscription.add(
            this.WarehousePartitionService.getWarehousePartitionData().subscribe(
                response => {
                    this.warehousePartition = response;
                    // console.log(response)
                }
            )
        )
    }

    getChecker() {
        this.subscription.add(
            this.FinishProductTransferService.getCheckerData().subscribe(
                response => {
                    this.checker = response;
                    // console.log(response)
                }
            )
        )
    }

    getFinishProduct() {
        this.subscription.add(
            this.FinishProductService.getFinishProductData().subscribe(
                response => {
                    this.finishProduct = response;
                    // console.log(response)
                }
            )
        )
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    showDialog() {
        this.visible = true;
        this.dialogHeader = 'Add Finish Product Transfer';
        this.clearForm();
    }

    clearForm() {
        this.transferForm.reset();
        this.transferForm.patchValue({FinishProductTransferID: 0})
    }

    onSubmit() {
        let authObs: Observable<ResponseData>;
        authObs = this.FinishProductTransferService.saveData
        (
            this.transferForm.value.FinishProductTransferID,
            this.transferForm.value.DateTransfer.toLocaleDateString(),
            this.transferForm.value.FromWarehouseID.WarehouseID,
            this.transferForm.value.FromWarehousePartitionID.WarehousePartitionID,
            this.transferForm.value.ToWarehouseID.WarehouseID,
            this.transferForm.value.ToWarehousePartitionID.WarehousePartitionID,
            this.transferForm.value.FinishProductID.FinishProductID,
            this.transferForm.value.Quantity,
            this.transferForm.value.CheckerID.CheckerID,
            this.transferForm.value.UserID,
        )
 
        authObs.subscribe(response =>{

            if( response === 1) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.transferForm.value.FinishProductID.FinishProduct +  ' successfully recorded', life: 3000 });
                this.getData();
                this.clearForm();
            } 
            else if ( response === 2) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.transferForm.value.FinishProductID.FinishProduct +  ' successfully updated', life: 3000 });
                this.getData();
                this.clearForm();
            }
            else if ( response === 0) {
                this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.transferForm.value.FinishProductID.FinishProduct +  ' already exist', life: 3000 });
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
        this.dialogHeader = 'Edit Finish Product Transfer';

        let FromWarehouseValue = this.findObjectByID(data.FromWarehouseID, 'WarehouseID', this.warehouse);

        let ToWarehouseValue = this.findObjectByID(data.ToWarehouseID, 'WarehouseID', this.warehouse);

        let FromWarehousePartitionValue = this.findObjectByID(data.FromWarehousePartitionID, 'WarehousePartitionID', this.warehousePartition);

        let ToWarehousePartitionValue = this.findObjectByID(data.ToWarehousePartitionID, 'WarehousePartitionID', this.warehousePartition);

        let CheckerValue = this.findObjectByID(data.CheckerID, 'CheckerID', this.checker);

        let FinishProductValue = this.findObjectByID(data.FinishProductID, 'FinishProductID', this.finishProduct);

        this.transferForm.setValue({
            FinishProductTransferID: data.FinishProductTransferID,
            DateTransfer: new Date(data.DateTransfer.date),
            FromWarehouseID: FromWarehouseValue,
            FromWarehousePartitionID: FromWarehousePartitionValue,
            ToWarehouseID: ToWarehouseValue,
            ToWarehousePartitionID: ToWarehousePartitionValue,
            FinishProductID: FinishProductValue,
            Quantity: data.Quantity,
            CheckerID: CheckerValue,
            UserID: data.UserID
        })

    }

    onSelectWarehouse(data: any, targetWarehousePartition: any[]) {
        if (data) {
            // targetWarehousePartition = [];
            targetWarehousePartition.length = 0;

            for (let i = 0; i <= this.warehousePartition.length -1; i++) {
                if (data.WarehouseID === this.warehousePartition[i].WarehouseID) {
                    targetWarehousePartition.push(this.warehousePartition[i])
                }
            }

        }
    }

    onSelectFromWarehouse(data: any) {
        this.selectedFromWarehouse = [];
        this.onSelectWarehouse(data, this.selectedFromWarehouse);
    }
    
    onSelectToWarehouse(data: any) {
        this.selectedToWarehouse = [];
        this.onSelectWarehouse(data, this.selectedToWarehouse);
    }

    onDelete(id: any) {
        this.FinishProductTransferService.onDeleteData(id).subscribe(
            response => {
               if (response === 3 ) {
                    this.MessageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
                this.getData();
               }
               
           }
        )
    }

    confirm2(event: Event, id: any) {
        this.ConfirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Do you want to delete this record?',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger p-button-sm',
            accept: () => {
                this.onDelete(id);
            },
            reject: () => {
                // this.MessageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
            }
        });
    }

     // ==== INPUT SEARCH DATA====
     onGlobalFilter(table: Table, event: Event) {
        const inputValue = (event.target as HTMLInputElement).value;
        table.filterGlobal(inputValue, 'contains');
    }
}

interface ResponseData {

}