import { Component, NgZoneOptions, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { RawMatsPOService } from "./rawmats-po.service";
import { Observable, Subscription } from "rxjs";
import { SupplierService } from "../supplier/supplier.service";
import { TruckService } from "../truck/truck.service";
import { MessageService } from "primeng/api";
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

    rawMatsPOForm!: FormGroup;

    isLoading: boolean = false;

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

    private subscription: Subscription = new Subscription;

    constructor
    (
        private RawMatsPOService: RawMatsPOService,
        private SuppplierService: SupplierService,
        private TruckService: TruckService,
        private MessageService: MessageService,
        private RawMaterialService: RawMaterialsService,
        private UsersService: UsersService,
        private auth: AuthService
    ) {}

    ngOnInit(): void {
        this.rawMatsPOForm = new FormGroup({
            'PurchaseOrderID': new FormControl(0),
            'PONo': new FormControl(0),
            'PODate': new FormControl(null),
            'DeliveryDate': new FormControl(null),
            'Terms': new FormControl(null),
            'PRNumber': new FormControl(null),
            'SupplierID': new FormControl(null),
            'SupplierAddress': new FormControl(null),
            'TotalQuantity': new FormControl(null),
            'TotalAmount': new FormControl(null),
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
        this.getTruck();
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
        this.subscription.add(
            this.RawMatsPOService.getData().subscribe(
                response => {
                    this.rawMatsPO = response;
                    this.isLoading = false;
                }
            )
        )
    }

    getSupplier() {
        this.subscription.add(
            this.SuppplierService.getSupplierData().subscribe(
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

    addOrder() {
        let data = {
            PurchaseOrderDetailID: 0,
            MaterialCode: '',
            RawMaterialID: '',
            Quantity: 0,
            UnitPrice: 0,
            deleted: 0,
            Amount: 0
        }

        this.OrderDetail.push(data);
    }

    removeOrder(index: number) {
        this.OrderDetail.splice(index, 1);
        this.onComputeAmount();
    }

    showDialog(dialog: Dialog) {
        if (!this.insert) {
            this.MessageService.add({ 
                severity: 'error', summary: 'Warning', 
                detail: 'You are not authorized!', 
                life: 3000 
            });
            return;
        }

        this.dialogHeader = 'Add RawMats P.O'
        this.visible = !this.visible;
        this.clearForms();
        this.OrderDetail = [];
        this.addOrder();
        dialog.maximize();
    }

    clearForms() {
        this.rawMatsPOForm.reset();
        this.rawMatsPOForm.patchValue({ PurchaseOrderID: 0 })
    }

    onGlobalFilter(table: Table, event: Event) {
        const inputValue = (event.target as HTMLInputElement).value;
        table.filterGlobal(inputValue, 'contains');
    }

    onSelectSupplier(data: any) {
        if (data.value === null) {
            this.rawMatsPOForm.patchValue({SupplierAddress: null});
            return;
        }
        this.rawMatsPOForm.patchValue({SupplierAddress: data.value.Address})
        // console.log(data.value);
    }

    onSubmit() {

        if(!this.rawMatsPOForm.valid) {
            alert('please fill all the blanks')
            return
        }

        this.submitLoading = true;

        let authObs: Observable<ResponseData>;
        authObs = this.RawMatsPOService.savedata
        (
            this.rawMatsPOForm.value.PurchaseOrderID,
            this.rawMatsPOForm.value.PONo,
            this.rawMatsPOForm.value.PODate.toLocaleDateString(),
            this.rawMatsPOForm.value.DeliveryDate.toLocaleDateString(),
            this.rawMatsPOForm.value.Terms,
            this.rawMatsPOForm.value.PRNumber,
            this.rawMatsPOForm.value.SupplierID.SupplierID,
            this.rawMatsPOForm.value.SupplierAddress,
            this.rawMatsPOForm.value.TotalQuantity,
            this.rawMatsPOForm.value.TotalAmount,
            this.rawMatsPOForm.value.deleted,
            this.userID,
            this.OrderDetail
        )

        authObs.subscribe(response =>{
            this.submitLoading = false;

            if( response === 1) {
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'Item: ' + this.rawMatsPOForm.value.PONo +  ' successfully recorded', 
                    life: 3000 
                });
                this.clearForms();
                this.getData();
                this.visible = false;
            } 
            else if ( response === 2) {
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'Item: ' + this.rawMatsPOForm.value.PONo +  ' successfully updated', 
                    life: 3000 
                });
                this.clearForms();
                this.getData();
                this.visible = false;
            }
            else if ( response === 0) {
                this.MessageService.add({ 
                    severity: 'error', 
                    summary: 'Danger', 
                    detail: 'Item: ' + this.rawMatsPOForm.value.PONo +  ' already exist', 
                    life: 3000 
                });
            }
            
        }, 
        errorMessage => {
            this.submitLoading = false;
            this.MessageService.add({ 
                severity: 'error', summary: 'Danger', 
                detail: errorMessage, 
                life: 3000 
            });
        })

        // console.log(this.rawMatsPOForm.value)
        // console.log(this.OrderDetail);

    }

       // find object for dropdown
    findObjectByID( selectedID: number, idName: string, array: any[]) {
        for (let i = 0; i <= array.length -1; i++) {
            if (selectedID === array[i][idName]) {
                return array[i];
            }
        }
        return null; 
    }

    onSelect(data: any, dialog: any) {
        // console.log(data);
        if(!this.edit) {
            this.MessageService.add({ 
                severity: 'error', summary: 'Warning', 
                detail: 'You are not authorized!', 
                life: 3000 
            });
            return;
        }

        this.visible = !this.visible;
        this.clearForms();
        dialog.maximize();
        this.dialogHeader = 'Edit RawMats P.O';
        this.OrderDetail = [];

        let SupplierValue = this.findObjectByID(data.SupplierID, 'SupplierID', this.supplier);

        this.rawMatsPOForm.patchValue({
            PurchaseOrderID: data.PurchaseOrderID,
            PONo: data.PONo,
            PODate: new Date(data.PODate.date),
            DeliveryDate: new Date(data.DeliveryDate.date),
            Terms: data.Terms,
            PRNumber: data.PRNumber,
            SupplierID: SupplierValue,
            SupplierAddress: data.SupplierAddress,
            TotalQuantity: data.TotalQuantity,
            TotalAmount: data.TotalAmount,
            deleted: data.deleted,
            UserID: this.userID
        })

        console.log(data.OrderDetail)

        this.OrderDetail = [...data.OrderDetail];

        this.onComputeAmount();

        // this.RawMatsPOService.getRawMatsPODetail(data.PurchaseOrderID).subscribe(
        //     response => {
        //         for (let i = 0; i < response.length; i++) {
        //             let data = {};
        //             let DescriptionValue = this.findObjectByID(response[i].RawMaterialID, 'RawMaterialID', this.rawMaterial);
        //             data = {
        //                 PurchaseOrderDetailID: response[i].PurchaseOrderDetailID,
        //                 MaterialCode: response[i].MaterialCode,
        //                 RawMaterialID: DescriptionValue,
        //                 Quantity: response[i].Quantity,
        //                 UnitPrice: response[i].UnitPrice,
        //                 deleted: response[i].deleted,
        //                 Amount: response[i].Amount
        //             }
        //             this.OrderDetail.push(data);
        //         }
        //         this.onComputeAmount();
        //     }
        // )
    }


    onComputeAmount() {
        let TotalAmount = 0;
        let Quantity = 0;
        for (let i = 0; i < this.OrderDetail.length ; i++) {
            if (this.OrderDetail[i].Quantity && this.OrderDetail[i].UnitPrice) {
                this.OrderDetail[i].Amount = this.OrderDetail[i].Quantity * this.OrderDetail[i].UnitPrice;
                TotalAmount += this.OrderDetail[i].Quantity * this.OrderDetail[i].UnitPrice;
                Quantity += this.OrderDetail[i].Quantity;
            }
        }

        this.rawMatsPOForm.patchValue({TotalQuantity: Quantity});
        this.rawMatsPOForm.patchValue({TotalAmount: TotalAmount});
    }

    getOrderItem(orderDetail: any) {
        return orderDetail
        .filter((item: any) => item.RawMaterial)  // Filter out items without RawMaterial
        .map((item: any) => item.RawMaterial!)   // Map to RawMaterial, using non-null assertion
        .join(', ');        
    }

}

interface ResponseData {

}