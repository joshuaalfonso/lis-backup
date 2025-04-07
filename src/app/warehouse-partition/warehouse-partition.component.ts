import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { WarehousePartitionService } from "./warehouse-partition.service";
import { Subscription, Observable, take } from "rxjs";
import { ConfirmationService, Message, MessageService } from "primeng/api";
import { Table } from "primeng/table";
import { WarehouseService } from "../warehouse/warehouse.service";
import { UsersService } from "../users/users.service";
import { AuthService } from "../auth/auth.service";
import { SystemLogsService } from "../system-logs/system-logs.service";



@Component({
    selector: 'app-warehouse-partition',
    templateUrl: 'warehouse-partition.component.html',
    styleUrls: ['warehouse-partition.component.css']
})
export class WarehousePartition implements OnInit, OnDestroy {

    warehousePartition: any[] = [];
    warehousePartitionError: Message[] = [];

    warehouse: any[] = [];

    warehousePartitionForm!: FormGroup;

    visible: boolean = false;

    isLoading: boolean = false;

    dialogHeader?: string;

    view: boolean = false;
    insert: boolean = false;
    edit: boolean = false;
    generateReport: boolean = false;

    first: number = 0;

    rows: number = 10;

    userID: string = '';

    submitLoading: boolean = false;

    private subscription: Subscription = new Subscription();

    constructor(
        private WarehousePartitionService: WarehousePartitionService,
        private MessageService: MessageService,
        private ConfirmationService: ConfirmationService,
        private WarehouseService: WarehouseService,
        private UsersService: UsersService,
        private auth: AuthService,
        private SystemLogsService: SystemLogsService
    ){}

    ngOnInit(): void {
        this.warehousePartitionForm = new FormGroup({
            'WarehousePartitionID': new FormControl(0),
            'WarehouseID': new FormControl(null, Validators.required),
            'WarehousePartitionName': new FormControl(null, Validators.required),
            'MaximumCapacity': new FormControl(null, Validators.required),
            'TotalWeight': new FormControl(null),
            'TotalQuantity': new FormControl(null),
            'UserID': new FormControl(0)
        });

        this.subscription.add(
            this.auth.user.subscribe(
                user => {
                    if (user) {
                        this.userID = user.user_id;
                        this.getUserAccess(this.userID);
                    }
                }
            )
        )

        this.getData();
        this.getWarehouse();
        this.logWarehousePartitionView();
    } 

    getUserAccess(UserID: string) {
        this.subscription.add(
            this.UsersService.getUserAccess(UserID).subscribe(
                response => {
                    let userRights = response;

                    for (let i = 0; i < userRights.length; i++) {
                        switch (userRights[i].AccessRight.trim()) {
                            case '2.4.1':
                                this.view = true;
                                break;
                            case '2.4.2':
                                this.insert = true;
                                break;
                            case '2.4.3':
                                this.edit = true;
                                break;
                            case '2.4.4':
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
    
    getRoundedPercentage(served: number, requestWeight: number, precision: number): number {
        if (requestWeight === 0) return 0; // Avoid division by zero
        const percentage = (served / requestWeight) * 100;
        // return Number(percentage.toFixed(2)); 
    
        return Math.round(percentage);
    }

    getData() {
        this.isLoading = true;
        this.subscription.add(
            this.WarehousePartitionService.getWarehousePartitionData().subscribe(
                response => {
                    this.warehousePartition = response;
                    this.isLoading = false;
                },
                error => {
                    console.log(error);
                    this.warehousePartitionError = [{ severity: 'error', detail: 'There was an error fetching warehouse partition' }];
                }
            )
        )
    }

    logWarehousePartitionView() {

        if (!this.userID) {
            alert('No logged in user');
            return
        };

        const data = {
            UserID: this.userID,
            TableName: 'Warehouse Partition'
        };

        this.SystemLogsService.sytemLogView(data).pipe(take(1)).subscribe(
            response => {
                console.log(response);
            },
            error => {
                console.log(error);
                this.warehousePartitionError = [{ severity: 'error', detail: 'An unkown error occured' }]
            }
        );

    }

    getWarehouse() {
        this.subscription.add(
            this.WarehouseService.getWarehouseData().subscribe(
                (response) => {
                    this.warehouse = response;
                    for (let i = 0; i <= this.warehouse.length -1; i++) {
                        this.warehouse[i] = {...this.warehouse[i], LocationName: `${this.warehouse[i].WarehouseLocation} - ${this.warehouse[i].Warehouse_Name}`}
                    }
                }
            )
        )
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    showDialog() {
        if (!this.insert) {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'You are not authorized!', life: 3000 });
            return;
        }

        this.visible = true;
        this.dialogHeader = 'Add Warehouse Partition';
        this.clearForm();
    }

    clearForm() {
        this.warehousePartitionForm.reset();
        this.warehousePartitionForm.patchValue({WarehousePartitionID: 0, UserID: 0})
    }

    onSubmit() {
        if (!this.insert && !this.edit) {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'You are not authorized!', life: 3000 });
            return;
        }

        this.submitLoading = true;

        let authObs: Observable<ResponseData>;
        authObs = this.WarehousePartitionService.saveData
        (
            this.warehousePartitionForm.value.WarehousePartitionID,
            this.warehousePartitionForm.value.WarehouseID.WarehouseID,
            this.warehousePartitionForm.value.WarehousePartitionName, 
            this.warehousePartitionForm.value.MaximumCapacity, 
            this.warehousePartitionForm.value.TotalWeight, 
            this.warehousePartitionForm.value.TotalQuantity, 
            this.userID
        );

        authObs.subscribe(response =>{

            this.submitLoading = false;

            if( response === 1) {
                this.visible = false;
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'Successfully recorded', 
                    life: 3000 
                });
                this.visible = false;
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
                this.visible = false;
                this.getData();
                this.clearForm();
            }
            else if ( response === 0) {
                this.MessageService.add({ 
                    severity: 'error', 
                    summary: 'Danger', 
                    detail: 'Item: ' + this.warehousePartitionForm.value.WarehousePartitionName +  ' already exist', 
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

    onSelect(data: any) {
        if (!this.edit) {
            this.MessageService.add({ 
                severity: 'error', 
                summary: 'Danger', 
                detail: 'You are not authorized!', 
                life: 3000 
            });
            return;
        }

        this.clearForm();
        this.visible = true;
        this.dialogHeader = 'Edit Warehouse Partition';

        let warehouseValue = {};

        for(let i = 0; i <= this.warehouse.length -1; i++) {
            if(this.warehouse[i].WarehouseID == data.WarehouseID) {
                warehouseValue = this.warehouse[i];
                break;
            }
        }

        this.warehousePartitionForm.setValue({
            WarehousePartitionID: data.WarehousePartitionID,
            WarehouseID: warehouseValue,
            WarehousePartitionName: data.WarehousePartitionName,
            MaximumCapacity: data.MaximumCapacity,
            TotalWeight: data.TotalWeight,
            TotalQuantity: data.TotalQuantity,
            UserID: data.UserID
        })
    }

    onDelete(id: any) {
        this.WarehousePartitionService.onDeleteData(id).subscribe(
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

    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
        console.log(event)
    }

}
interface ResponseData{

}

interface PageEvent {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
}
