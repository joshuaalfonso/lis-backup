import { Component, OnDestroy, OnInit } from "@angular/core";
import { FinishProductInventoryService } from "./finish-product-inventory.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { ConfirmationService, MessageService } from "primeng/api";
import { Table } from "primeng/table";
import { UsersService } from "../users/users.service";
import { AuthService } from "../auth/auth.service";




@Component({
    selector: 'app-finish-product-inventory',
    templateUrl: 'finish-product-inventory.component.html',
    styleUrls: ['finish-product-inventory.component.css']
})
export class FinishProductInventory implements OnInit, OnDestroy{

    inventory: any[] = [];

    inventoryForm!: FormGroup;

    visible: boolean = false;

    isLoading: boolean = false;

    dialogHeader?: string;

    fromDate?: string;
    toDate?: string;

    minDate: Date = new Date(2024, 0, 1);
    maxDate: Date = new Date();

    view: boolean = false;
    generateReport: boolean = false;
    

    private subscription: Subscription = new Subscription();

    constructor(
        private FinishProductInvetoryService: FinishProductInventoryService,
        private MessageService: MessageService,
        private ConfirmationService: ConfirmationService,
        private UsersService: UsersService,
        private auth: AuthService
    ) {}

    ngOnInit(): void {
        this.inventoryForm = new FormGroup({
            'FinishProductInventoryID': new FormControl(0),
            'FinishProductID': new FormControl(null, Validators.required),
            'InventoryDate': new FormControl(null, Validators.required),
            'BeginQty': new FormControl(null, Validators.required),
            'ProductionOutput': new FormControl(null, Validators.required),
            'OutgoingQty': new FormControl(null, Validators.required),
            'Condemned': new FormControl(null, Validators.required),
            'EndingQty': new FormControl(null, Validators.required),

        })

        this.auth.user.subscribe(
            user => {
                if (user) {
                    this.getUserAccess(user!.user_id);
                }
            }
        )

        this.getData();
    }

    getUserAccess(UserID: string) {
        this.subscription.add(
            this.UsersService.getUserAccess(UserID).subscribe(
                response => {
                    let userRights = response;

                    for (let i = 0; i < userRights.length; i++) {
                        switch (userRights[i].AccessRight) {
                            case 4.1:
                                this.view = true;
                                break;
                            case 4.4:
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
        if (this.fromDate && this.toDate) {
            this.filterDateRange();

        } else {
            this.getRawMatsData();
        }
       
    }

    getRawMatsData() {
        this.isLoading = true;
        this.subscription.add(
            this.FinishProductInvetoryService.getInventoryData().subscribe(
                response => {
                    this.inventory = response;
                    // console.log(response)
                    this.isLoading = false;
                }
            )
        )
    }

    filterDateRange() {
        if (!this.view) {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'You are not authorized!', life: 3000 });
        }

        this.isLoading = true;
        if (!this.fromDate || !this.toDate) return;
        this.subscription.add(
                this.FinishProductInvetoryService.FilterData(this.formatDate(this.fromDate), this.formatDate(this.toDate)).subscribe(
                    response => {
                        this.inventory = response;
                        this.isLoading = false;
                    }
                )
        )
    }

    formatDate(date: any) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        return year + '-' + month + '-' + day;
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    showDialog() {
        this.visible = true;
        this.dialogHeader = 'Add Finish Product Inventory';
        this.clearForm();
    }

    clearForm() {
        this.inventoryForm.setValue({
            FinishProductInventoryID: 0,
            FinishProductID: null,
            InventoryDate: null,
            BeginQty: null,
            ProductionOutput: null,
            OutgoingQty: null,
            Condemned: null,
            EndingQty: null
        })
    }

    onSubmit() {
        let authObs: Observable<ResponseData>;
        authObs = this.FinishProductInvetoryService.saveData
        (
            this.inventoryForm.value.FinishProductInventoryID,
            this.inventoryForm.value.FinishProductID,
            this.inventoryForm.value.InventoryDate,
            this.inventoryForm.value.BeginQty,
            this.inventoryForm.value.ProductionOutput,
            this.inventoryForm.value.OutgoingQty,
            this.inventoryForm.value.Condemned,
            this.inventoryForm.value.EndingQty,
        ) 

        authObs.subscribe(response =>{

            if( response === 1) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully recorded', life: 3000 });
                this.getData();
                this.clearForm();
            } 
            else if ( response === 2) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully updated', life: 3000 });
                this.getData();
                this.clearForm();
            }
            else if ( response === 0) {
                this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.inventoryForm.value.FinishProductID +  ' already exist', life: 3000 });
            }
            
        }, errorMessage => {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        })

    }

    onSelect(data: any) {
        this.showDialog();
        this.dialogHeader = 'Edit Finish Product Inventory';

        this.inventoryForm.setValue({
            FinishProductInventoryID: data.FinishProductInventoryID,
            FinishProductID: data.FinishProductID,
            InventoryDate: new Date(data.InventoryDate.date),
            BeginQty: data.BeginQty,
            ProductionOutput: data.ProductionOutput,
            OutgoingQty: data.OutgoingQty,
            Condemned: data.Condemned,
            EndingQty: data.EndingQty
        })
    }

    onDelete(id: any) {
        this.FinishProductInvetoryService.onDeleteData(id).subscribe(
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