import { Component, OnDestroy, OnInit } from "@angular/core";
import { RawMaterialInventoryService } from "./raw-material-inventory.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription, Observable, take } from "rxjs";
import { ConfirmationService, Message, MessageService } from "primeng/api";
import { Table } from "primeng/table";
import { ChangeDetectorRef } from '@angular/core';
import { Dropdown } from "primeng/dropdown";
import { RawMaterialsService } from "src/app/raw-materials/raw-materials.service";
import { UsersService } from "src/app/pages/users/users.service";
import { AuthService } from "src/app/auth/auth.service";
import { SystemLogsService } from "src/app/pages/system-logs/system-logs.service";




@Component({
    selector: 'app-raw-material-inventory',
    templateUrl: 'raw-material-inventory.component.html',
    styleUrls: ['raw-material-inventory.component.css']
})
export class RawMaterialInventoryComponent implements OnInit, OnDestroy{

    inventory: Inventory[] = [];

    inventoryError: Message[] = [];

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

    userID!: string;

    private subscription: Subscription = new Subscription();

    constructor(
        private RawMaterialInventoryService: RawMaterialInventoryService,
        private RawMaterialService: RawMaterialsService,
        private UsersService: UsersService,
        private auth: AuthService,
        private SystemLogsService: SystemLogsService
        
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
                    this.userID = user.user_id;
                    this.getUserAccess(user!.user_id);
                }
            }
        )

        this.getData();
        this.getRawMaterial();
        this.logRawMaterialInventoryView();
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
        this.isLoading = true;
        this.subscription.add(
            this.RawMaterialInventoryService.FilterData( this.formatDate(this.fromDate),  this.formatDate(this.toDate)).subscribe(
                response => {
                    this.isLoading = false;
                    this.inventory = response;
                    this.filterInventory = [...this.inventory];
                    // this.filterInventory = response;
                    // this.isReset = true;
                    // this.getData();
                    this.onSelectRawMaterial();
                },
                error => {
                    this.isLoading = false;
                    console.log(error);
                    this.inventoryError = [{ severity: 'error', detail: 'There wass an error fetching Inventory' }]
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
                },
                error => {
                    console.log(error);
                    this.inventoryError = [{ severity: 'error', detail: 'There wass an error fetching Inventory' }]
                }
            )
        )
    }

    getRawMaterial() {
        this.subscription.add(
            this.RawMaterialService.getRawMatsData().subscribe(
                (response) => {
                    this.rawMaterial = response;
                    // console.log(response)
                }
            )
        )
    }

    logRawMaterialInventoryView() {

        if (!this.userID) {
            alert('No logged in user');
            return
        }

        const data = {
            UserID: this.userID,
            TableName: 'Raw Material Inventory'
        }

        this.SystemLogsService.sytemLogView(data).pipe(take(1)).subscribe(
            response => {
                console.log(response);
            },
            error => {
                console.log(error);
                this.inventoryError = [{ severity: 'error', detail: 'An unkown error occured' }]
            }
        );

    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
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
