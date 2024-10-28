import { Component, OnDestroy, OnInit } from "@angular/core";
import { DeliveryService } from './delivery.service'
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { ConfirmationService, MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import { Table } from "primeng/table";
import { CustomerService } from "../cutomer/customer.service";
import { FinishProductService } from "../finish-product/finish-product.service";
import { WarehousePartitionService } from "../warehouse-partition/warehouse-partition.service";
import { Dialog } from "primeng/dialog";
import { DeliveryScheduleService } from "../delivery-schedule/delivery-schedule.service";
import { TruckService } from "../truck/truck.service";
import { AuthService } from "../auth/auth.service";
import { UsersService } from "../users/users.service";


@Component({
    selector: 'app-delivery',
    templateUrl: 'delivery.component.html',
    styleUrls: ['delivery.component.css']
})

export class DeliveryComponent implements OnInit, OnDestroy{

    delivery: any[] = [];

    customer: any[] = [];

    finishProduct: any[] = [];

    truck: any[] = [];

    DeliveryDetail : any[] = [];

    warehousePartitionStock: any[] = [];

    warehousePartition: any[] = [];

    deliverySchedule: any[] = [];

    deliveryForm!: FormGroup;

    totalQuantity?: number;

    totalWeight?: number;

    visible: boolean = false;

    DeliveryScheduleModal: boolean = false;

    partitionModal: boolean = false;

    selectedOrderIndex!: number;

    isLoading: boolean = false;

    dialogHeader?: string;

    view: boolean = false;
    insert: boolean = false;
    edit: boolean = false;
    generateReport: boolean = false;

    private subscription: Subscription = new Subscription();

    constructor(
        private DeliveryService: DeliveryService,
        private MessageService: MessageService,
        private ConfirmationService: ConfirmationService,
        private CustomerService: CustomerService,
        private FinishProductService: FinishProductService,
        private WarehousePartitionService: WarehousePartitionService,
        private DeliveryScheduleService: DeliveryScheduleService,
        private TruckService: TruckService,
        private auth: AuthService,
        private UsersService: UsersService
    ) {}

    ngOnInit(): void {
        this.deliveryForm = new FormGroup({
            'DeliveryID': new FormControl(0),
            'DeliveryNo': new FormControl(null, Validators.required),
            'PurchaseOrderNo': new FormControl(null, Validators.required),
            'KiloPerBag': new FormControl(0),
            'DeliveryDate': new FormControl(null, Validators.required),
            'CustomerID': new FormControl({value: null,disabled: true}),
            'SONumber': new FormControl(null, Validators.required),
            'Address': new FormControl({value: null,disabled: true}),
            'TruckID': new FormControl({value: null,disabled: true}),
            'DeliverySchedTotalQty': new FormControl(null),
            'TotalQty': new FormControl(0, Validators.required),
            'TotalWeight': new FormControl({value: null, disabled: true}),
            'UserID': new FormControl(0)
        })

        this.userAccess();

        this.getData();
        this.getTruck();
        this.getWarehousePartition();
        this.getFinishProduct();
        this.getCustomer();
    }

    userAccess() {
        this.subscription.add(
            this.auth.user.subscribe(
                user => {
                    this.getUserAccess(user!.user_id);
                }
            )
        )
    }

    getUserAccess(UserID: string) {
        this.subscription.add(
            this.UsersService.getUserAccess(UserID).subscribe(
                response => {
                    let userRights = response;

                    for (let i = 0; i < userRights.length; i++) {
                        switch (userRights[i].AccessRight) {
                            case 29.1:
                                this.view = true;
                                break;
                            case 29.2:
                                this.insert = true;
                                break;
                            case 29.3:
                                this.edit = true;
                                break;
                            case 29.4:
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
            this.DeliveryService.getDeliveryData().subscribe(
                response => {
                    this.delivery = response;
                    this.isLoading = false;
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

    getFinishProduct() {
        this.subscription.add(
            this.FinishProductService.getFinishProductData().subscribe(
                response => {
                    this.finishProduct = response;
                }
            )
        )
    }

    getWarehousePartition() {
        this.subscription.add(
            this.WarehousePartitionService.getWarehousePartitionData().subscribe(
                (response: WarehousePartition[]) => {
                    this.warehousePartition = response;
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

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    // show add delivery dialog
    showDialog(dialog: Dialog) {
        this.visible = true;
        this.dialogHeader = 'Add Delivery';
        this.clearForm();
        this.DeliveryDetail = [];
        dialog.maximize();
    }

    showDeliveryScheduleDialog() {
        this.DeliveryScheduleModal = !this.DeliveryScheduleModal;
    }

    showPartitionDialog() {
        this.partitionModal = !this.partitionModal;
    }

    // clear dialog inputs
    clearForm() {
        this.deliveryForm.reset();
        this.deliveryForm.patchValue({DeliveryID: 0})
    }

    // submit data
    onSubmit() {

        // console.log(this.deliveryForm.value.DeliverySchedTotalQty);
        // console.log(this.deliveryForm.value.TotalQty);

        let status = '';
        if (this.deliveryForm.value.DeliverySchedTotalQty > this.deliveryForm.value.TotalQty) {
            status = 'Partial';
        } else if (this.deliveryForm.value.DeliverySchedTotalQty == this.deliveryForm.value.TotalQty) {
            status = 'Completed';
        } 
        else if (this.deliveryForm.value.DeliverySchedTotalQty < this.deliveryForm.value.TotalQty) {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Total quantity exceeds', life: 3000 });
            return;
        }

        // console.log(this.deliveryForm.value);
        // console.log(this.DeliveryDetail);

        // let authObs: Observable<ResponseData>;
        // authObs = this.DeliveryService.saveData
        // (
        //     this.deliveryForm.value.DeliveryID,
        //     this.deliveryForm.value.DeliveryNo,
        //     this.deliveryForm.value.SONumber,
        //     this.deliveryForm.value.PurchaseOrderNo,
        //     this.deliveryForm.value.DeliveryDate.toLocaleDateString(),
        //     this.deliveryForm.value.CustomerID,
        //     this.deliveryForm.value.TotalQty,
        //     this.DeliveryDetail ,
        //     status,
        //     this.deliveryForm.value.UserID
        // )

        // authObs.subscribe(response =>{

        //     if( response === 1) {
        //         this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.deliveryForm.value.DeliveryNo +  ' successfully recorded', life: 3000 });
        //         this.getData();
        //         this.clearForm();
        //     } 
        //     else if ( response === 2) {
        //         this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.deliveryForm.value.DeliveryNo +  ' successfully updated', life: 3000 });
        //         this.getData();
        //         this.clearForm();
        //     }
        //     else if ( response === 0) {
        //         this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.deliveryForm.value.DeliveryNo +  ' already exist', life: 3000 });
        //     }
            
        // }, errorMessage => {
        //     this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        // })
    }

    // edit delivery
    onSelect(data: any, dialog: Dialog) {

        this.showDialog(dialog);
        this.dialogHeader = 'Edit Delivery';

        this.DeliveryScheduleService.getDeliveryScheduleData().subscribe(
            response => {
                let deliveryScheduleResponse = response

                let selectedDeliverySchedule;

                for (let i = 0; i <= deliveryScheduleResponse.length -1; i++) {
                    if (data.SONumber == deliveryScheduleResponse[i].SONumber) {
                        selectedDeliverySchedule = deliveryScheduleResponse[i];
                        break;
                    }
                }

                // reuse onSelectSoNumber function
                this.onSelectSoNumber(selectedDeliverySchedule, data.DeliveryID) 
            }
            
        )

        this.deliveryForm.patchValue({
            DeliveryID: data.DeliveryID,
            DeliveryNo: data.DeliveryNo,
            DeliveryDate: new Date(data.DeliveryDate.date),
            PurchaseOrderNo: data.PurchaseOrderNo,
            TotalQty: data.TotalQty,
            KiloPerBag: data.KiloPerBag,
            UserID: data.UserID
        })

    } 


    // show delivery schedule modal
    onShowDeliverySchedule() {
        this.DeliveryScheduleModal = true;

        this.DeliveryService.getDeliverySchedules().subscribe(
            response => {
                this.deliverySchedule = response;
            }
        )
    }

    // select so number for add / edit delivery
    onSelectSoNumber(data: any, DeliveryID?: number) {

        let selected_truck;

        for (let i = 0; i <= this.truck.length -1; i++) {
            if (data.TruckID == this.truck[i].TruckID) {
                selected_truck = this.truck[i];
                break;
            }
        }

        let selected_customer;

        for (let i = 0; i <= this.customer.length -1; i++) {
            if (data.CustomerID == this.customer[i].CustomerID) {
                selected_customer = this.customer[i];
                break;
            }
        }
        
        this.DeliveryScheduleService.getDeliveryScheduleDetailData(data.DeliveryScheduleID).subscribe(
            response => {
                let deliveryDetailsResponse = response;

                this.DeliveryDetail = [];
                for ( let i = 0; i <= deliveryDetailsResponse.length -1; i++) {                    

                    let selected_product;

                    for (let row = 0; row <= this.finishProduct.length -1; row++) {
                        if (deliveryDetailsResponse[i].FinishProductID == this.finishProduct[row].FinishProductID) {
                            selected_product = this.finishProduct[row];
                            break;
                        }
                    }
                                    
                    let data = {
                        DeliveryScheduleDetailsID: deliveryDetailsResponse[i].DeliveryScheduleDetailsID,
                        Index: i,
                        FinishProductID: selected_product,
                        Quantity: deliveryDetailsResponse[i].Quantity,
                        Orders: []
                    };
              
                    this.DeliveryDetail.push(data);
                } 
                
                if (DeliveryID) {
                    this.DeliveryService.getOrderDetails(DeliveryID).subscribe(
                        response => {
                            let deliveryDetailsResponse = response;

                            for (let i = 0; i <= this.DeliveryDetail.length -1; i++) {
                                for (let j = 0; j <= deliveryDetailsResponse.length -1; j++) {
                                    if (this.DeliveryDetail[i].FinishProductID.FinishProductID == deliveryDetailsResponse[j].FinishProductID ) {
                                        this.DeliveryDetail[i].Orders.push(deliveryDetailsResponse[j]);
                                    }
                                }
                            } 
                            this.ComputeTotalWeight();
                        }
                    )
                }
            },

            error => {
                console.error('Error fetching data:', error)
            }
        )

        this.deliveryForm.patchValue({
            SONumber: data.SONumber,
            Address: data.Address,
            TruckID: selected_truck,
            CustomerID: selected_customer,
            DeliverySchedTotalQty: data.TotalQty
        })

    }

    // insert delivery to specific finish product
    insertRow(index:number){
        if (!this.DeliveryDetail[index].FinishProductID) {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'No finish product', life: 3000 });
            return
        };

        this.selectedOrderIndex = index;

        let FinishProductID = this.DeliveryDetail[index].FinishProductID.FinishProductID;

        this.showPartitionDialog();

        this.subscription.add(
            this.DeliveryService.getWarehousePartitionStock(FinishProductID).subscribe(
                response => {
                    this.warehousePartitionStock = response
                }
            )
        )
               
    }

    // push seleceted partition 
    onSelectPartition(selectedPartition: any) {

        let data = {
          DeliveryDetailID: 0,
          WarehousePartitionStockID: selectedPartition.WarehousePartitionStockID,
          WarehouseLocation: selectedPartition.WarehouseLocation,
          StockingDate: selectedPartition.StockingDate,
          Warehouse_Name: selectedPartition.Warehouse_Name,
          WarehouseID: selectedPartition.WarehouseID,
          WarehousePartitionID: selectedPartition.WarehousePartitionID,
          WarehousePartitionName: selectedPartition.WarehousePartitionName,
          Quantity: selectedPartition.FinProdQty,
          Weight: selectedPartition.FinProdWeight,
          NetWeight: 0,
          AvailStock: selectedPartition.FinProdQty,
          AvailWeight: selectedPartition.FinProdWeight
        }
        
        // check if the selected partition already exist
        for (let i = 0; i <= this.DeliveryDetail[this.selectedOrderIndex].Orders.length -1; i++) {
            if (selectedPartition.WarehousePartitionStockID == this.DeliveryDetail[this.selectedOrderIndex].Orders[i].WarehousePartitionStockID) {
                this.MessageService.add({ severity: 'warn', summary: 'warn', detail: 'Partition stock already exist', life: 3000 });
                return;
            }
        }

        this.DeliveryDetail[this.selectedOrderIndex].Orders.push(data);


        this.showPartitionDialog();
        
    }

    // remove row from orders
    removeOrderRow(expansionIndex:number,  index: number) {
        this.DeliveryDetail[expansionIndex].Orders.splice(index, 1);
        this.ComputeTotalQuantity();
    }

    // compute total quanity of orders
    ComputeTotalQuantity() {
        this.totalQuantity = 0;

        for (let i = 0; i <= this.DeliveryDetail.length -1; i++) {

            if (this.DeliveryDetail[i].FinishProductID == 0) 
            return;

            for (let j = 0; j <= this.DeliveryDetail[i].Orders.length -1; j++) {
                 this.totalQuantity = this.totalQuantity + this.DeliveryDetail[i].Orders[j].Quantity;
            }

        }
    }
    
    // compute total weight for orders
    ComputeTotalWeight() {
        this.totalWeight = 0;

        for (let i = 0; i <= this.DeliveryDetail.length -1; i++) {

            if (this.DeliveryDetail[i].FinishProductID == 0) 
            return;

            for (let j = 0; j <= this.DeliveryDetail[i].Orders.length -1; j++) {
                 this.totalWeight = this.totalWeight + this.DeliveryDetail[i].Orders[j].Weight;
            }

        }
    }

    onDelete(id: any) {
        this.DeliveryService.onDeleteData(id).subscribe(
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

interface WarehousePartition {
    WarehousePartitionID: number,
    WarehousePartitionName: string,
    WarehouseID: number,
    Warehouse_Name: string,
    MaximumCapacity: number,
    TotalWeight: number,
    TotalQuantity: number,
    UserID: number,
}