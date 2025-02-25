import { Component, OnDestroy, OnInit } from "@angular/core";
import { WarehouseService } from "./warehouse.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription, Observable } from "rxjs";
import { ConfirmationService, MessageService } from "primeng/api";
import { Table } from "primeng/table";
import { UsersService } from "../users/users.service";
import { AuthService } from "../auth/auth.service";


@Component({
    selector: 'app-warehouse',
    templateUrl: 'warehouse.component.html',
    styleUrls: ['warehouse.component.css']
})
export class WarehouseComponent implements OnInit, OnDestroy{

    warehouse: any[] = [];

    visible!: boolean;

    warehouseForm!: FormGroup;

    location: any[] = [];

    selectedLocation: Location | undefined;

    isLoading: boolean = false;

    dialogHeader?: string;

    view: boolean = false;
    insert: boolean = false;
    edit: boolean = false;
    generateReport: boolean = false;

    UserID!: string;

    selectedFilter: number = 0;

    submitLoading: boolean = false;

    private subscription: Subscription = new Subscription();

    constructor(
        private WarehouseService: WarehouseService,
        private MessageService: MessageService,
        private ConfirmationService: ConfirmationService,
        private UsersService: UsersService,
        private auth: AuthService
    ){}

    ngOnInit(): void {
        this.warehouseForm = new FormGroup({
            'WarehouseID': new FormControl(0),
            'WarehouseLocationID': new FormControl(null, Validators.required),
            'Warehouse_Name': new FormControl(null, Validators.required),
            'MaximumCapacity': new FormControl(null),
            'MinimumCapacity': new FormControl(null),
            'TotalQuantity': new FormControl(0),
            'TotalWeight': new FormControl(0),
            'Remarks': new FormControl(null),
            'UserID': new FormControl(0),
        })

        this.subscription.add(
            this.auth.user.subscribe(
                user => {
                    if (user) {
                        this.UserID = user.user_id;
                        this.getUserAccess(this.UserID);
                    }
                }
            )
        )

        this.getData();
    }

    getUserAccess(UserID: string) {

        this.subscription.add(
            this.UsersService.getUserAccess(UserID).subscribe(

                response => {
                    let userRights = response;

                    for (let i = 0; i < userRights.length; i++) {
                        switch (userRights[i].AccessRight.trim()) {
                            case '2.3.1':
                                this.view = true;
                                break;
                            case '2.3.2':
                                this.insert = true;
                                break;
                            case '2.3.3':
                                this.edit = true;
                                break;
                            case '2.3.4':
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
            this.WarehouseService.getWarehouseData().subscribe( 
                (response) => {
                    this.warehouse = response;
                    this.isLoading = false;
                    // console.log(response); 
                }
            ) 
        )   

        this.subscription.add(
            this.WarehouseService.getWarehouseLocation().subscribe( 
                (response) => {
                    this.location = response;
                    // console.log(response)
                } 
            )
        )  
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getRoundedPercentage(served: number, requestWeight: number, precision: number): number {
        if (requestWeight === 0) return 0; // Avoid division by zero
        const percentage = (served / requestWeight) * 100;
        // return Number(percentage.toFixed(2)); 
    
        return Math.round(percentage);
    }

    showDialog() {

        if (!this.insert) {

            this.MessageService.add({ 
                severity: 'error', 
                summary: 'Danger', 
                detail: 'You are not authorized!', 
                life: 3000 
            });

            return;
        }

        this.visible = true;
        this.dialogHeader = 'Add Warehouse';
        this.clearForm();

    }

    clearForm() {
        this.warehouseForm.reset();
        this.warehouseForm.patchValue({
            WarehouseID: 0, 
            TotalQuantity: 0, 
            TotalWeight: 0
        })
    }

    onSubmit() {

        if (!this.insert && !this.edit) {

            this.MessageService.add({ 
                severity: 'error', 
                summary: 'Danger', 
                detail: 'You are not authorized!', 
                life: 3000 
            });

            return;
        }

        this.submitLoading = true;

        let authObs: Observable<ResponseData>;

        authObs = this.WarehouseService.saveData (
            this.warehouseForm.value.WarehouseID, 
            this.warehouseForm.value.WarehouseLocationID.WarehouseLocationID, 
            this.warehouseForm.value.Warehouse_Name, 
            this.warehouseForm.value.MaximumCapacity, 
            this.warehouseForm.value.MinimumCapacity, 
            this.warehouseForm.value.TotalQuantity, 
            this.warehouseForm.value.TotalWeight, 
            this.warehouseForm.value.Remarks, 
            this.UserID
        )

        authObs.subscribe(response => {

            this.submitLoading = false;

            if( response === 1) {

                this.visible = false;
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'Successfully recorded', 
                    life: 3000 
                });

                this.getData();
                this.clearForm();

            } 
            else if ( response === 2) {

                this.visible = false;
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'Successfully updated', 
                    life: 3000 
                });

                this.getData();
                this.clearForm();

            }
            else if ( response === 0) {

                this.MessageService.add({ 
                    severity: 'error', 
                    summary: 'Danger', 
                    detail: 'Item: ' + this.warehouseForm.value.Warehouse_Name +  ' already exist', 
                    life: 3000 
                });
                
            }
            
        }, errorMessage => {
            this.MessageService.add({ 
                severity: 'error', 
                summary: 'Danger', 
                detail: errorMessage, 
                life: 3000 
            });
            this.submitLoading = false;
        })
    }

    onSelect(data:any) {
        this.clearForm();
        this.visible = true;
        this.dialogHeader = 'Edit Warehouse';

        let location_value = {};

        for(let i= 0; i <= this.location.length -1; i++) {
            if(this.location[i].WarehouseLocationID == data.WarehouseLocationID) {
                location_value = this.location[i];
                break;
            }
        }

        this.warehouseForm.setValue({
            WarehouseID: data.WarehouseID,
            WarehouseLocationID: location_value,
            Warehouse_Name: data.Warehouse_Name,
            MaximumCapacity: data.MaximumCapacity,
            MinimumCapacity: data.MinimumCapacity,
            TotalQuantity: data.TotalQuantity,
            TotalWeight: data.TotalWeight,
            Remarks: data.Remarks,
            UserID: this.UserID
        });

    }

    // ==== DELETE CONFIRMATION ====
    onDelete(id: any) {
        this.WarehouseService.onDeleteData(id).subscribe(
            response => {

               if (response === 3 ) {
                    this.MessageService.add({ 
                        severity: 'info', 
                        summary: 'Confirmed', 
                        detail: 'Record deleted', 
                        life: 3000 
                    });

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


    get filteredWarehouses() {

        if (!this.selectedFilter) {
            return this.warehouse;
        }

        const filteredWarehouse = this.warehouse.filter((warehouse) => (
            warehouse.WarehouseLocationID === this.selectedFilter
        ));

        return filteredWarehouse;
        
    }

    onSelectLocation(WarehouseLocationID: number) {
        this.selectedFilter = WarehouseLocationID;
    }

}

interface City {
    WarehouseLocation: string;
    WarehouseLocationID: string;
}

interface ResponseData {

}