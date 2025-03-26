import { Component, NgZoneOptions, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { RawMatsPOService } from "./rawmats-po.service";
import { Observable, Subscription } from "rxjs";
import { SupplierService } from "../supplier/supplier.service";
import { TruckService } from "../truck/truck.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { Dialog } from "primeng/dialog";
import { RawMaterialsService } from "../raw-materials/raw-materials.service";
import { Table } from "primeng/table";
import { UsersService } from "../users/users.service";
import { AuthService } from "../auth/auth.service";




@Component({
    selector: 'app-contract-po',
    templateUrl: 'rawmats-po.component.html',
    styleUrls: ['rawmats-po.component.css']
})
export class RawMatsPOComponent implements OnInit{

    rawMatsPO: any[] = [];
    isLoading: boolean = false;

    rawMatsPOForm!: FormGroup;


    visible: boolean = false;

    dialogHeader: string = '';

    supplier: any[] = [];

    truck: any[] = [];

    rawMaterial: any[] = [];

    OrderDetail: any[] = [];

    view: boolean = false;
    insert: boolean = false;
    edit: boolean = false;
    generateReport: boolean = false;

    userID: string = '';

    submitLoading: boolean = false;

    position: string = 'center';

    tabValue: number = 1;

    selectedPO!: any;

    private subscription: Subscription = new Subscription;

    constructor
    (
        private RawMatsPOService: RawMatsPOService,
        private SuppplierService: SupplierService,
        private TruckService: TruckService,
        private MessageService: MessageService,
        private RawMaterialService: RawMaterialsService,
        private UsersService: UsersService,
        private auth: AuthService,
        private ConfirmationService: ConfirmationService,
    ) {}

    ngOnInit(): void {
        this.rawMatsPOForm = new FormGroup({
            'PurchaseOrderID': new FormControl(0),
            'PONo': new FormControl(null, Validators.required),
            'PODate': new FormControl(null, Validators.required),
            'DeliveryDate': new FormControl(null, Validators.required),
            'PRNumber': new FormControl(null, Validators.required),
            'SupplierID': new FormControl(null, Validators.required),
            'RawMaterialID': new FormControl(null, Validators.required),
            'Weight': new FormControl(null, Validators.required),
            'UnitPricePerKilo': new FormControl(null),
            'Remarks': new FormControl(null),
            'deleted': new FormControl(null),
            'UserID': new FormControl(0),
        })

        this.subscription.add(
            this.auth.user.subscribe(
                user => {
                    if (user) {
                        this.userID = user!.user_id;
                        this.getUserAccess(this.userID);
                    }
                }
            )
        )

        this.getData();
        this.getSupplier();
        // this.getTruck();
        this.getRawMaterial();
    }

    getUserAccess(UserID: string) {
        this.subscription.add(
            this.UsersService.getUserAccess(UserID).subscribe(
                response => {
                    let userRights = response;

                    for (let i = 0; i < userRights.length; i++) {
                        switch (userRights[i].AccessRight.trim()) {
                            case '3.1.1':
                                this.view = true;
                                break;
                            case '3.1.2':
                                this.insert = true;
                                break;
                            case '3.1.3':
                                this.edit = true;
                                break;
                            case '3.1.4':
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

        let observable;

        if (this.tabValue == 1) {
            observable = this.RawMatsPOService.getData();
        } else if (this.tabValue == 2) {
            observable = this.RawMatsPOService.getRawMatsPOCompleted();
        }
    
        if (observable) {
            this.subscription.add(
                observable.subscribe(
                    response => {
                        this.rawMatsPO = response;
                        this.isLoading = false;
                    },
                    error => {
                        this.isLoading = false;
                        // Optionally, handle the error (e.g., show an alert)
                        console.error('Error fetching data:', error);
                    }
                )
            );
        } else {
            // Handle the case where tabValue doesn't match either condition
            console.warn('Invalid tabValue');
            this.isLoading = false;
        }

        // console.log('asd');
        
    

    }

    getSupplier() {
        this.subscription.add(
            this.SuppplierService.getLocalSupplier().subscribe(
                response => {
                    this.supplier = response;
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

    getRawMaterial() {
        this.subscription.add(
            this.RawMaterialService.getRawMatsData().subscribe(
                response => {
                    this.rawMaterial = response;
                }
            )
        )
    }

    openModal(rawMatsPO: any = null) {
        this.visible = true;
        this.selectedPO = rawMatsPO;
        // console.log(this.selectedPO);        
    }

    closeModal(rawMatsPO: any = null) {
        this.visible = false;
        this.selectedPO = rawMatsPO;
        // console.log(this.selectedPO);        
    }

    onGlobalFilter(table: Table, event: Event) {
        const inputValue = (event.target as HTMLInputElement).value;
        table.filterGlobal(inputValue, 'contains');
    }


    getRoundedPercentage(served: number, requestWeight: number, precision: number): number {
        if (requestWeight === 0) return 0; // Avoid division by zero
        const percentage = (served / requestWeight) * 100;
        // return Number(percentage.toFixed(2)); 
    
        return Math.round(percentage);
    }


    poCompleted(id: any) {

        this.RawMatsPOService.poCompleted(id).subscribe(
            response => {

                if ( response === 2) {
                    this.MessageService.add({ 
                        severity: 'success', 
                        summary: 'Success', 
                        detail: 'Successfully Updated!', 
                        life: 3000 
                    });
                    this.getData();
                }

            }, error => {
                this.MessageService.add({ 
                    severity: 'error', summary: 'Danger', 
                    detail: error || 'Unknown error occured', 
                    life: 3000 
                });
            }
        )

    }


    // confirmCompletedPO(position: string, row: any) {
    //     this.position = position;        

    //     if (!row.PurchaseOrderID) {
    //         alert('Unkown error occured');
    //         return
    //     }

    //     const purchaseOrderID = row.PurchaseOrderID;
    //     const po = row.PONo;

    //     this.ConfirmationService.confirm({
    //         message: `Are you sure '${po}' is now completed ?`,
    //         header: 'Confirmation',
    //         icon: 'pi pi-info-circle',
    //         acceptIcon:"none",
    //         rejectIcon:"none",
    //         rejectButtonStyleClass:"p-button-text",
    //         accept: () => {
    //             this.poCompleted(purchaseOrderID);
    //         },
    //         reject: () => {
    //             // this.MessageService.add({ severity: 'error', summary: 'Rejected', detail: 'Process incomplete', life: 3000 });
    //         },
    //         key: 'positionDialog'
    //     });
    // }

}

interface ResponseData {

}