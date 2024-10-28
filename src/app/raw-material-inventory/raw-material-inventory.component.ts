import { Component, OnDestroy, OnInit } from "@angular/core";
import { RawMaterialInventoryService } from "./raw-material-inventory.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription, Observable } from "rxjs";
import { ConfirmationService, MessageService } from "primeng/api";
import { Table } from "primeng/table";
import { RawMaterialsService } from "../raw-materials/raw-materials.service";
import { ChangeDetectorRef } from '@angular/core';
import { Dropdown } from "primeng/dropdown";
import { UsersService } from "../users/users.service";
import { AuthService } from "../auth/auth.service";



@Component({
    selector: 'app-raw-material-inventory',
    templateUrl: 'raw-material-inventory.component.html',
    styleUrls: ['raw-material-inventory.component.css']
})
export class RawMaterialInventoryComponent implements OnInit, OnDestroy{

    inventory: Inventory[] = [];

    filterInventory: Inventory[] = [];

    inventoryForm!: FormGroup;

    visible: boolean = false;

    rawMaterial: any[]= [];
    
    date: Date | undefined;

    fromDate: Date | undefined;
    toDate: Date | undefined;
    selectedRawMats: number | undefined;
    
    isReset: boolean = false;

    minDate: Date = new Date(2024, 0, 1);
    maxDate: Date = new Date();

    isLoading: boolean = false;

    view:boolean = false;
    // insert: boolean = false;
    // edit: boolean = false;
    generateReport: boolean = false;

    dialogHeader?: string;

    private subscription: Subscription = new Subscription();

    constructor(
        private RawMaterialInventoryService: RawMaterialInventoryService,
        private MessageService: MessageService,
        private ConfirmationService: ConfirmationService,
        private RawMaterialService: RawMaterialsService,
        private UsersService: UsersService,
        private auth: AuthService
        
    ) {}

    ngOnInit(): void {

        this.inventoryForm = new FormGroup({
            'RawMaterialInventoryID': new FormControl(0),
            'RawMaterialID': new FormControl(null, Validators.required),
            'InventoryDate': new FormControl(null, Validators.required),
            'BeginQty': new FormControl(null),
            'BeginWeight': new FormControl(null),
            'BeginPrice': new FormControl(null),
            'IncomingQty': new FormControl(null),
            'IncomingWeight': new FormControl(null),
            'IncomingPrice': new FormControl(null),
            'BinloadingQty': new FormControl(null, Validators.required),
            'BinloadingWeight': new FormControl(null, Validators.required),
            'BinloadingPrice': new FormControl(null, Validators.required),
            'CondemQty': new FormControl(null),
            'CondemWeight': new FormControl(null),
            'CondemPrice': new FormControl(null),
            'EndingQty': new FormControl(null),
            'EndingWeight': new FormControl(null),
            'EndingPrice': new FormControl(null)
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
                            case 3.1:
                                this.view = true;
                                break;
                            case 3.4:
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


    onChangeProduct( event: any) {
        const selectedRawMaterial = event.value.RawMaterial;
        // table.filterGlobal(selectedRawMaterial, 'contains');
        // console.log(event.value)
    }
    

    onChangeFrom(event: any) {

        if(this.fromDate && this.toDate) {
            this.filterDateRange();
        }
    }

    onChangeTo(event: any) {

        if(this.fromDate && this.toDate) {
            this.filterDateRange();
        }
    }

    filterDateRange() {
        this.subscription.add(
            this.RawMaterialInventoryService.FilterData( this.formatDate(this.fromDate),  this.formatDate(this.toDate)).subscribe(
                response => {
                    this.inventory = response;
                    this.filterInventory = [...this.inventory];
                    // this.filterInventory = response;
                    // this.isReset = true;
                    // this.getData();
                    this.onSelectRawMaterial();
                }
            )   
        )
    }

    handleChipRemove() {
        // this.filterInventory = undefined;
        this.filterInventory = [...this.inventory]
        this.fromDate = undefined;
        this.toDate = undefined;
        this.getData();
    }

    resetFilter(table: Table) {
        table.filterGlobal('', 'contains');
        // this.filterInventory = undefined;
        this.fromDate = undefined;
        this.toDate = undefined;
        this.isReset = false;
        this.getData();
    }

    formatDate(date: any) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        return year + '-' + month + '-' + day;
    }

    getData() {
        this.isLoading = true;
        this.subscription.add(
            this.RawMaterialInventoryService.getInventoryData().subscribe(
                (response) => {
                    // if (this.filterInventory) {
                    //     this.inventory = this.filterInventory;
                    // } else {
                    //     this.inventory = response;
                    // }
                    this.isLoading = false;
                    this.inventory = response;
                    this.filterInventory = [...this.inventory]
                }
            )
        )

        this.subscription.add(
            this.RawMaterialService.getRawMatsData().subscribe(
                (response) => {
                    this.rawMaterial = response;
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
        this.dialogHeader = 'Add Inventory'
        this.clearForm();
    }

    clearForm() {
        this.inventoryForm.reset();
        this.inventoryForm.patchValue({ 'RawMaterialInventoryID': 0})
    }

    onSubmit() {
        let authObs: Observable<ResponseData>;
        authObs = this.RawMaterialInventoryService.saveData
        (
            this.inventoryForm.value.RawMaterialInventoryID, 
            this.inventoryForm.value.RawMaterialID.RawMaterialID, 
            this.inventoryForm.value.InventoryDate.toLocaleDateString(), 
            this.inventoryForm.value.BeginQty, 
            this.inventoryForm.value.BeginWeight, 
            this.inventoryForm.value.BeginPrice, 
            this.inventoryForm.value.IncomingQty, 
            this.inventoryForm.value.IncomingWeight, 
            this.inventoryForm.value.IncomingPrice, 
            this.inventoryForm.value.BinloadingQty, 
            this.inventoryForm.value.BinloadingWeight, 
            this.inventoryForm.value.BinloadingPrice, 
            this.inventoryForm.value.CondemQty, 
            this.inventoryForm.value.CondemWeight, 
            this.inventoryForm.value.CondemPrice, 
            this.inventoryForm.value.EndingQty, 
            this.inventoryForm.value.EndingWeight, 
            this.inventoryForm.value.EndingPrice
        );

        authObs.subscribe(response =>{

            if( response === 1) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.inventoryForm.value.RawMaterialID.RawMaterial +  ' successfully recorded', life: 3000 });
                this.getData();
                this.clearForm();
            } 
            else if ( response === 2) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.inventoryForm.value.RawMaterialID.RawMaterial +  ' successfully updated', life: 3000 });
                this.getData();
                this.clearForm();
            }
            else if ( response === 0) {
                this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.inventoryForm.value.RawMaterialID.RawMaterial +  ' already exist', life: 3000 });
            }

            else if ( response === -1) {
                this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.inventoryForm.value.RawMaterialID.RawMaterial +  ' Exceeds stocks', life: 3000 });
            }
            
        }, errorMessage => {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        })

    }

    onSelect(data: any) {
        this.showDialog();
        this.dialogHeader = 'Edit Inventory'

        let rawMaterialValue = {};
      
        for(let i = 0; i <= this.rawMaterial.length -1; i++) {
            if(this.rawMaterial[i].RawMaterialID == data.RawMaterialID) {
                rawMaterialValue = this.rawMaterial[i];
                break;
            }
        }

        this.inventoryForm.setValue({
            RawMaterialInventoryID: data.RawMaterialInventoryID,
            RawMaterialID: rawMaterialValue,
            InventoryDate: new Date(data.InventoryDate.date),
            BeginQty: data.BeginQty,
            BeginWeight: data.BeginWeight,
            BeginPrice: data.BeginPrice,
            IncomingQty: data.IncomingQty,
            IncomingWeight: data.IncomingWeight,
            IncomingPrice: data.IncomingPrice,
            BinloadingQty: data.BinloadingQty,
            BinloadingWeight: data.BinloadingWeight,
            BinloadingPrice: data.BinloadingPrice,
            CondemQty: data.CondemQty,
            CondemWeight: data.CondemWeight,
            CondemPrice: data.CondemPrice,
            EndingQty: data.EndingQty,
            EndingWeight: data.EndingWeight,
            EndingPrice: data.EndingPrice  
        })
    }

    onDelete(id: any) {
        this.RawMaterialInventoryService.onDeleteData(id).subscribe(
            response => {
               if (response === 3 ) {
                    this.MessageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
                this.getData();
               }
               
           }
        )
    }

    confirm(event: Event) {
        this.ConfirmationService.confirm({
            target: event.target as EventTarget,
            // message: 'Please confirm to proceed moving forward.',
            // icon: 'pi pi-exclamation-circle',
            // acceptIcon: 'pi pi-check mr-1',
            // rejectIcon: 'pi pi-times mr-1',
            // rejectButtonStyleClass: 'p-button-danger p-button-sm',
            // acceptButtonStyleClass: 'p-button-outlined p-button-sm',
            // accept: () => {
            //     this.MessageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
            // },
            // reject: () => {
            //     this.MessageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
            // }
        });
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

    onSelectRawMaterial() {
        if (!this.selectedRawMats) {
            this.filterInventory = [...this.inventory];
            return;
        }

        this.filterInventory = this.inventory.filter((item: any) => item.RawMaterialID === this.selectedRawMats)

    }

    getRawMaterialName(id: any) {
        const rawMaterialItem = this.rawMaterial.find(({ RawMaterialID }) => id === RawMaterialID);
        return rawMaterialItem ? rawMaterialItem.RawMaterial : null; 
    }

    onRemoveRawmatsChip() {
        this.selectedRawMats = 0;
        this.onSelectRawMaterial();
    }

}

interface Inventory {

}
interface ResponseData {

}

interface RawMaterial {

}