import { Component, OnDestroy, OnInit } from "@angular/core";
import { DeliveryScheduleService } from "./delivery-schedule.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomerService } from "../cutomer/customer.service";
import { TruckService } from "../truck/truck.service";
import { Observable, Subscription, filter } from "rxjs";
import { MessageService } from "primeng/api";
import { FinishProductService } from "../finish-product/finish-product.service";
import { Dialog } from "primeng/dialog";
import { DeliveryService } from "../delivery/delivery.service";
import { AuthService } from "../auth/auth.service";
import { UsersService } from "../users/users.service";



@Component({
    selector: 'app-app-schedule',
    templateUrl: 'delivery-schedule.component.html',
    styleUrls: ['delivery-schedule.component.css']
})

export class DeliveryScheduleComponent implements OnInit, OnDestroy{

    deliverySchedule: any[] = [];
    deliveryScheduleForm!: FormGroup;
    deliveryScheduleDetail: any[] = [];
    truck: any[] = [];
    customer: any[] = [];
    finishProduct: any[] = [];
    warehousePartitionStock: any[] =[];
    totalQuantity?: number;
    deliveryForm!: FormGroup;
    DeliveryDetail : any[] = [];
    totalWeight?: number;
    stateOptions: any[] = [{ label: 'Pending', value: 'Pending' },{ label: 'Partial', value: 'Partial' }, {label: 'Completed', value: 'Completed'}];
    value: string = 'Pending';
    selectedOrderIndex!: number;
    deliveryTotalQuantity?: number;
    filteredDeliverySchedule: any[] = [];
    isLoading: boolean = false;
    deliveryFormVisible: boolean = false;
    visible: boolean = false;
    partitionModal: boolean = false;
    delivery: any[] = [];
    private subscriptions = new Subscription();

    view: boolean = false;
    insert: boolean = false;
    edit: boolean = false;
    generateReport: boolean = false;

    constructor(
        private DeliveryScheduleService: DeliveryScheduleService,
        private CustomerService: CustomerService,
        private TruckService: TruckService,
        private MessageService: MessageService,
        private FinishProductService: FinishProductService,
        private DeliveryService: DeliveryService,
        private auth: AuthService,
        private UsersService: UsersService
    ) {}

    ngOnInit(): void {

        this.deliveryScheduleForm = new FormGroup({
            'DeliveryScheduleID': new FormControl(null, Validators.required),
            'SONumber': new FormControl(null, Validators.required),
            'CustomerID': new FormControl(null, Validators.required),
            'Address': new FormControl(null, Validators.required),
            'TruckID': new FormControl(null, Validators.required),
            'DateSchedule': new FormControl(null, Validators.required),
            'TotalQty': new FormControl(null, Validators.required),
            'Status': new FormControl('Pending'),
            'UserID': new FormControl(0),
        })

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
            'TotalWeight': new FormControl(0),
            'UserID': new FormControl(0)
        })

        
        this.userAccess();
        // this.getData();
        this.getCustomerData();
        this.getTruckData();
        this.getFinishProductData();
        this.getDelivery();

        this.onSelectFilter(this.value)
    }

    userAccess() {
        this.subscriptions.add(
            this.auth.user.subscribe(
                user => {
                    this.getUserAccess(user!.user_id);
                }
            )
        )
    }

    getUserAccess(UserID: string) {
        this.subscriptions.add(
            this.UsersService.getUserAccess(UserID).subscribe(
                response => {
                    let userRights = response;
               
                    for (let i = 0; i < userRights.length; i++) {
                        switch (userRights[i].AccessRight) {
                            case 28.1:
                                this.view = true;
                                break;
                            case 28.2:
                                this.insert = true;
                                break;
                            case 28.3:
                                this.edit = true;
                                break;
                            case 28.4:
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

        // if (this.filteredDeliverySchedule.length != 0) {
            this.deliverySchedule = this.filteredDeliverySchedule;
            // return;
        // }
        
        // this.subscriptions.add(
        //     this.DeliveryScheduleService.getDeliveryScheduleData().subscribe(
        //         response => {
        //            this.deliverySchedule = response;
        //         }
        //     )
        // )
    }

    getCustomerData() {
        this.subscriptions.add(
            this.CustomerService.getCustomerData().subscribe(
                response => {
                    this.customer = response;
                }
            )
        )
    }

    getTruckData() {
       this.subscriptions.add(
            this.TruckService.GetTruckData().subscribe(
                response => {
                    this.truck = response;
                }
            )
       )
    }

    getFinishProductData() {
        this.subscriptions.add(
            this.FinishProductService.getFinishProductData().subscribe(
                response => {
                    this.finishProduct = response;
                }
            )
        )
    }

    getDelivery() {
        this.subscriptions.add(
            this.DeliveryService.getDeliveryData().subscribe(
                response => {
                    this.delivery = response;
                }
            )
        )
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    showDialog() {
        this.visible = true;
        this.clearForm();
        this.addDelivery();
    }

    showPartitionDialog() {
        this.partitionModal = !this.partitionModal;
    }

    addDelivery(){
        let data = {
          DeliveryScheduleDetailsID: 0,
          FinishProductID: 0,
          Quantity: 0,
        };

        this.deliveryScheduleDetail.push(data);
    }

    removeOrder(index: any) {
        this.deliveryScheduleDetail.splice(index, 1);
        this.ComputeTotalQuantity();
    }

    clearForm() {
        this.deliveryScheduleForm.reset();
        this.deliveryScheduleForm.patchValue({DeliveryScheduleID: 0, Status: 'Pending'})
        this.deliveryScheduleDetail = [];
    }

    onSubmit() {
        // console.log(this.deliveryScheduleDetail);
        // console.log(this.deliveryScheduleForm.value)

        let authObs: Observable<ResponseData>
        authObs = this.DeliveryScheduleService.saveData
        (
            this.deliveryScheduleForm.value.DeliveryScheduleID,
            this.deliveryScheduleForm.value.SONumber,
            this.deliveryScheduleForm.value.CustomerID.CustomerID,
            this.deliveryScheduleForm.value.Address,
            this.deliveryScheduleForm.value.TruckID.TruckID,
            this.deliveryScheduleForm.value.DateSchedule.toLocaleDateString(),
            this.deliveryScheduleForm.value.TotalQty,
            this.deliveryScheduleDetail,
            this.deliveryScheduleForm.value.Status,
            this.deliveryScheduleForm.value.UserID
        )

        authObs.subscribe(response =>{

            if( response === 1) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.deliveryScheduleForm.value.SONumber +  ' successfully recorded', life: 3000 });
                // this.getData();
                this.onSelectFilter(this.value)
                this.clearForm();
            } 
            else if ( response === 2) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.deliveryScheduleForm.value.SONumber +  ' successfully updated', life: 3000 });
                // this.getData();
                this.clearForm();
                this.onSelectFilter(this.value)
            }
            else if ( response === 0) {
                this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.deliveryScheduleForm.value.SONumber +  ' already exist', life: 3000 });
            }
            
        }, errorMessage => {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        })
    }

    onSubmitDelivery() {
        
        let status = '';
        if (this.deliveryForm.value.DeliverySchedTotalQty > this.deliveryForm.value.TotalQty) {
            status = 'Partial';
        } else if (this.deliveryForm.value.DeliverySchedTotalQty == this.deliveryForm.value.TotalQty) {
            status = 'Completed';
        } else if (this.deliveryForm.value.DeliverySchedTotalQty < this.deliveryForm.value.TotalQty) {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Total quantity exceeds', life: 3000 });
            return;
        }

        let authObs: Observable<ResponseData>;
        authObs = this.DeliveryService.saveData
        (
            this.deliveryForm.value.DeliveryID,
            this.deliveryForm.value.DeliveryNo,
            this.deliveryForm.value.SONumber,
            this.deliveryForm.value.PurchaseOrderNo,
            this.deliveryForm.value.DeliveryDate.toLocaleDateString(),
            this.deliveryForm.value.CustomerID,
            this.deliveryForm.value.TotalQty,
            this.DeliveryDetail ,
            status,
            this.deliveryForm.value.UserID
        )

        authObs.subscribe(response =>{

            if( response === 1) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.deliveryForm.value.DeliveryNo +  ' successfully recorded', life: 3000 });
                // this.getData();
                this.onSelectFilter(this.value)
                this.deliveryForm.reset();
            } 
            else if ( response === 2) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.deliveryForm.value.DeliveryNo +  ' successfully updated', life: 3000 });
                // this.getData();
                this.onSelectFilter(this.value)
                this.deliveryForm.reset();
            }
            else if ( response === 0) {
                this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.deliveryForm.value.DeliveryNo +  ' already exist', life: 3000 });
            }
            
        }, errorMessage => {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        })

        // console.log(this.deliveryForm.value);
        // console.log(this.DeliveryDetail);
        // console.log(status);
    }

    findObjectByID( selectedID: number, idName: string, array: any[]) {
        for (let i = 0; i <= array.length -1; i++) {
            if (selectedID === array[i][idName]) {
                return array[i];
            }
        }
        return null; 
    }

    onSelect(data: any, dialog: Dialog) {
        dialog.maximize();

        this.deliveryScheduleDetail = [];
        this.visible = true;

        this.DeliveryScheduleService.getDeliveryScheduleDetailData(data.DeliveryScheduleID).subscribe(
            response => {

                let deliveryScheduleDetails = response;

                for (let i = 0; i <= deliveryScheduleDetails.length -1; i++) {

                    let FinishProductValue = {};

                    for (let j = 0; j <= this.finishProduct.length -1; j++) {
                        if (this.finishProduct[j].FinishProductID == deliveryScheduleDetails[i].FinishProductID) {
                            FinishProductValue = this.finishProduct[j]
                            break;
                        } 
                    }


                    let data = {
                        DeliveryScheduleDetailsID: deliveryScheduleDetails[i].DeliveryScheduleDetailsID,
                        FinishProductID: FinishProductValue,
                        Quantity: deliveryScheduleDetails[i].Quantity,
                    };
              
                    this.deliveryScheduleDetail.push(data);
                    
                }

                let CustomerValue = this.findObjectByID(data.CustomerID, 'CustomerID', this.customer);

                let TruckValue = this.findObjectByID(data.TruckID, 'TruckID', this.truck);

                this.deliveryScheduleForm.setValue({
                    DeliveryScheduleID: data.DeliveryScheduleID,
                    SONumber: data.SONumber,
                    CustomerID: CustomerValue,
                    Address: data.Address,
                    TruckID: TruckValue,
                    DateSchedule: new Date(data.DateSchedule.date),
                    TotalQty: data.TotalQty,
                    UserID: data.UserID,
                    Status: data.Status
                })

            }
        )

    }

    ComputeTotalQuantity() {
        this.totalQuantity = 0;

        for (let i = 0; i <= this.deliveryScheduleDetail.length -1; i++) {

            if (!this.deliveryScheduleDetail[i].FinishProductID) 
            return;

            this.totalQuantity = this.totalQuantity + this.deliveryScheduleDetail[i].Quantity;

        }
    }

    ComputeDeliveryTotalQuantity() {
        this.deliveryTotalQuantity = 0;

        for (let i = 0; i <= this.DeliveryDetail.length -1; i++) {

            if (this.DeliveryDetail[i].FinishProductID == 0) 
            return;

            for (let j = 0; j <= this.DeliveryDetail[i].Orders.length -1; j++) {
                 this.deliveryTotalQuantity = this.deliveryTotalQuantity + this.DeliveryDetail[i].Orders[j].Quantity;
            }

        }
        
    }

    onAddDelivery(data: any, dialog: Dialog) {
        // console.log(data);
        this.deliveryFormVisible = true;
        dialog.maximize();
        
        let selected_truck = this.findObjectByID(data.TruckID, 'TruckID', this.truck);

        let selected_customer = this.findObjectByID(data.CustomerID, 'CustomerID', this.customer);

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

        this.subscriptions.add(
            this.DeliveryService.getWarehousePartitionStock(FinishProductID).subscribe(
                response => {
                    this.warehousePartitionStock = response
                }
            )
        )
    }

    onSelectPartition(selectedPartition: any) {

        // this.DeliveryDetail[this.selectedOrderIndex].Quantity
        let QuantityPerProd = 0;

        for (let i = 0; i <= this.DeliveryDetail[this.selectedOrderIndex].Orders.length -1; i++) {
            QuantityPerProd = QuantityPerProd + this.DeliveryDetail[this.selectedOrderIndex].Orders[i].Quantity
        }

        // console.log(this.DeliveryDetail[this.selectedOrderIndex].Quantity - QuantityPerProd);
        
        let data = {
            DeliveryDetailID: 0,
            WarehousePartitionStockID: selectedPartition.WarehousePartitionStockID,
            WarehouseLocation: selectedPartition.WarehouseLocation,
            StockingDate: selectedPartition.StockingDate,
            Warehouse_Name: selectedPartition.Warehouse_Name,
            WarehousePartitionID: selectedPartition.WarehousePartitionID,
            WarehousePartitionName: selectedPartition.WarehousePartitionName,
            // Quantity: selectedPartition.FinProdQty,
            Quantity: this.DeliveryDetail[this.selectedOrderIndex].Quantity - QuantityPerProd,
            Weight: 0,
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

    ComputeTotalWeight() {
        
    }

    onSelectFilter(data: any) {
        this.value = data;

        // if (this.value === 'All') {
        //     this.filteredDeliverySchedule = [];
        //     this.getData();
        //     return;
        // }

        this.isLoading = true;
        this.DeliveryScheduleService.getDeliveryScheduleFilter(this.value).subscribe(
            response => {

                for (let i = 0; i <= response.length -1; i++) {
                    for (let j = 0; j <= this.delivery.length -1; j++) {
                        if (response[i].SONumber === this.delivery[j].SONumber) {
                            response[i] = {...response[i], DeliveryTotalQty: this.delivery[j].TotalQty}
                        }
                    }
                }

                this.filteredDeliverySchedule = response;
                this.getData();
                this.isLoading = false;

                // console.log(this.filteredDeliverySchedule);
            }
        )
    }


}

interface ResponseData {

}