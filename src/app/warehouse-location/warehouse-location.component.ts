import { Component, OnDestroy, OnInit } from "@angular/core";
import { WarehouseLocationService } from "./warehouse-location.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription, take } from "rxjs";
import { ConfirmationService, Message, MessageService } from "primeng/api";
import { Table } from "primeng/table";
import { UsersService } from "../users/users.service";
import { AuthService } from "../auth/auth.service";
import { SystemLogsService } from "../system-logs/system-logs.service";


@Component({
    selector: 'app-warehouse-location',
    templateUrl: 'warehouse-location.component.html',
    styleUrls: ['warehouse-location.component.css']
})
export class WarehouseLocationComponent implements OnInit, OnDestroy{

    constructor(
        private WarehouseLocationService: WarehouseLocationService,
        private MessageService: MessageService,
        private ConfirmationService: ConfirmationService,
        private UsersService: UsersService,
        private auth: AuthService,
        private SystemLogsService: SystemLogsService
    ){}

    warehouseLocation: any[]= [];
    warehouseLocationError: Message[] = [];
    isLoading: boolean = false;

    warehouseLocationForm!: FormGroup;

    dialogHeader!: string;

    visible: boolean = false;


    view: boolean = false;
    insert: boolean = false;
    edit: boolean = false;
    generateReport: boolean = false;

    userID: string = '';
    
    private subscription: Subscription = new Subscription();

    submitLoading: boolean = false;

    ngOnInit(): void {

        this.warehouseLocationForm = new FormGroup({
            'WarehouseLocationID': new FormControl(0),
            'WarehouseLocation': new FormControl(null, Validators.required),
            'UserID': new FormControl(0)
        })

        this.getData();

        this.subscription.add(
            this.auth.user.subscribe(
                user => {
                    if (user) {
                        if (user) {
                            this.userID = user.user_id;
                            this.getUserAccess(this.userID);
                        }
                    }
                }
            )
        )

        this.logWarehouseLocationView();
    }

    getRoundedPercentage(served: number, requestWeight: number, precision: number): number {
        if (requestWeight === 0) return 0; // Avoid division by zero
        const percentage = (served / requestWeight) * 100;
        // return Number(percentage.toFixed(2)); 
    
        return Math.round(percentage);
    }

    getUserAccess(UserID: string) {
        this.subscription.add(
            this.UsersService.getUserAccess(UserID).subscribe(
                response => {
                    let userRights = response;

                    for (let i = 0; i < userRights.length; i++) {
                        switch (userRights[i].AccessRight.trim()) {
                            case '2.2.1':
                                this.view = true;
                                break;
                            case '2.2.2':
                                this.insert = true;
                                break;
                            case '2.2.3':
                                this.edit = true;
                                break;
                            case '2.2.4':
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
            this.WarehouseLocationService.getWarehouseLocationData().subscribe(
                response => {
                    this.warehouseLocation = response;
                    this.isLoading = false;
                    // console.log(response);
                },
                error => {
                    this.isLoading = false;
                    console.log(error);
                    this.warehouseLocationError = [{ severity: 'error', detail: 'There was an error fetching data' }]
                } 
            )
        )
    }

    logWarehouseLocationView() {

        if (!this.userID) {
            alert('No logged in user');
            return
        }

        const data = {
            UserID: this.userID,
            TableName: 'Warehouse Location'
        }

        this.SystemLogsService.sytemLogView(data).pipe(take(1)).subscribe(
            response => {
                console.log(response);
            },
            error => {
                console.log(error);
                this.warehouseLocationError = [{ severity: 'error', detail: 'An unkown error occured' }]
            }
        );

    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
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
        this.dialogHeader = 'Add Warehouse Location';
        this.clearForm();
    }

    clearForm() {
        this.warehouseLocationForm.reset();
        this.warehouseLocationForm.patchValue({WarehouseLocationID: 0})
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
        authObs = this.WarehouseLocationService.saveData
        (
            this.warehouseLocationForm.value.WarehouseLocationID,
            this.warehouseLocationForm.value.WarehouseLocation,
            this.userID
        );

        authObs.subscribe(response =>{

            this.submitLoading = true;

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
                    summary: 'Warning', 
                    detail: 'Item: ' + this.warehouseLocationForm.value.WarehouseLocation +  ' already exist', 
                    life: 3000 
                });
            }
            
        }, errorMessage => {
            this.MessageService.add({ 
                severity: 'error', 
                summary: 'Warning', 
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
        this.dialogHeader = 'Edit Warehouse Location';

        this.warehouseLocationForm.setValue({
            WarehouseLocationID: data.WarehouseLocationID,
            WarehouseLocation: data.WarehouseLocation,
            // MaximumCapacity: data.MaximumCapacity,
            // TotalWeight: data.TotalWeight,
            // TotalQuantity: data.TotalQuantity,
            UserID: data.UserID
        })
    }

    onDelete(id: any) {

        this.WarehouseLocationService.onDeleteData(id).subscribe(
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

}

interface ResponseData{

}