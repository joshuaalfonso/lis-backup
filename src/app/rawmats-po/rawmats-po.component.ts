import { Component, NgZoneOptions, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
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
            'PONo': new FormControl(null, Validators.required),
            'PODate': new FormControl(null, Validators.required),
            'DeliveryDate': new FormControl(null, Validators.required),
            'Terms': new FormControl(null, Validators.required),
            'PRNumber': new FormControl(null, Validators.required),
            'SupplierID': new FormControl(null, Validators.required),
            'SupplierAddress': new FormControl(null, Validators.required),
            'RawMaterialID': new FormControl(null, Validators.required),
            'Quantity': new FormControl(null),
            'Weight': new FormControl(null),
            'deleted': new FormControl(null),
            'UserID': new FormControl(0),
            // 'OrderDetail': new FormArray([])
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

    // Method to add a new item (FormGroup) to the FormArray
    addPoItem() {
        const poItemGroup = new FormGroup({
            PurchaseOrderDetailID: new FormControl(0),
            MaterialCode: new FormControl(null, Validators.required),
            RawMaterialID: new FormControl(null, Validators.required),
            Quantity: new FormControl(null, Validators.required),
            UnitPrice: new FormControl(null),
            deleted: new FormControl(0),
            Amount: new FormControl(0)
        });

        (this.rawMatsPOForm.get('OrderDetail') as FormArray).push(poItemGroup);
    }

    removePoItem(index: number) {
        (this.rawMatsPOForm.get('OrderDetail') as FormArray).removeAt(index);
    }

    get poItems() {
        return (this.rawMatsPOForm.get('OrderDetail') as FormArray).controls;
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
        // this.OrderDetail = [];
        // this.addOrder();
        // (this.rawMatsPOForm.get('OrderDetail') as FormArray).clear();
        // this.addPoItem();
        // dialog.maximize();
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
        if (!data) {
            this.rawMatsPOForm.patchValue({SupplierAddress: null});
            return;
        }
        this.rawMatsPOForm.patchValue({SupplierAddress: this.supplier[data].Address})
        // console.log(data.value);
    }

    onSubmit() {

        if(!this.rawMatsPOForm.valid) {
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
            this.rawMatsPOForm.value.SupplierID,
            this.rawMatsPOForm.value.SupplierAddress,
            this.rawMatsPOForm.value.RawMaterialID,
            this.rawMatsPOForm.value.Quantity,
            this.rawMatsPOForm.value.Weight,
            this.rawMatsPOForm.value.deleted,
            this.userID,
            this.rawMatsPOForm.value.OrderDetail,
        )

        authObs.subscribe(response =>{
            this.submitLoading = false;

            if( response === 1) {
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'Successfully Recorded!', 
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
                    detail: 'Successfully Updated!', 
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
        // dialog.maximize();
        this.dialogHeader = 'Edit RawMats P.O';
        // this.OrderDetail = [];
        // (this.rawMatsPOForm.get('OrderDetail') as FormArray).clear();

        // let SupplierValue = this.findObjectByID(data.SupplierID, 'SupplierID', this.supplier);

        this.rawMatsPOForm.patchValue({
            PurchaseOrderID: data.PurchaseOrderID,
            PONo: data.PONo,
            PODate: new Date(data.PODate.date),
            DeliveryDate: new Date(data.DeliveryDate.date),
            Terms: data.Terms,
            PRNumber: data.PRNumber,
            SupplierID: data.SupplierID,
            SupplierAddress: data.SupplierAddress,
            RawMaterialID: data.RawMaterialID,
            Quantity: data.Quantity,
            Weight: data.Weight,
            TotalQuantity: data.TotalQuantity,
            TotalAmount: data.TotalAmount,
            deleted: data.deleted,
            UserID: this.userID
        })

        // 'PurchaseOrderID': new FormControl(0),
        // 'PONo': new FormControl(null, Validators.required),
        // 'PODate': new FormControl(null, Validators.required),
        // 'DeliveryDate': new FormControl(null, Validators.required),
        // 'Terms': new FormControl(null, Validators.required),
        // 'PRNumber': new FormControl(null, Validators.required),
        // 'SupplierID': new FormControl(null, Validators.required),
        // 'SupplierAddress': new FormControl(null, Validators.required),
        // 'RawMaterialID': new FormControl(null, Validators.required),
        // 'Quantity': new FormControl(null),
        // 'Weight': new FormControl(null),
        // 'deleted': new FormControl(null),
        // 'UserID': new FormControl(0),

        // console.log(data.OrderDetail)

        // this.OrderDetail = [...data.OrderDetail];

        // for (let i = 0; i < data.OrderDetail.length; i++) {

        //     const poItemGroup = new FormGroup({
        //         PurchaseOrderDetailID: new FormControl(data.OrderDetail[i].PurchaseOrderDetailID),
        //         MaterialCode: new FormControl(data.OrderDetail[i].MaterialCode, Validators.required),
        //         RawMaterialID: new FormControl(data.OrderDetail[i].RawMaterialID, Validators.required),
        //         Quantity: new FormControl(data.OrderDetail[i].Quantity, Validators.required),
        //         UnitPrice: new FormControl(data.OrderDetail[i].UnitPrice, Validators.required),
        //         deleted: new FormControl(data.OrderDetail[i].deleted),
        //         Amount: new FormControl(data.OrderDetail[i].Amount)
        //     });

        //     (this.rawMatsPOForm.get('OrderDetail') as FormArray).push(poItemGroup);
        // }

        // Method to add a new item (FormGroup) to the FormArray
        // addPoItem() {
        //     const poItemGroup = new FormGroup({
        //         PurchaseOrderDetailID: new FormControl(0),
        //         MaterialCode: new FormControl(null, Validators.required),
        //         RawMaterialID: new FormControl(null, Validators.required),
        //         Quantity: new FormControl(null, Validators.required),
        //         UnitPrice: new FormControl(null, Validators.required),
        //         deleted: new FormControl(0),
        //         Amount: new FormControl(0)
        //     });

        //     (this.rawMatsPOForm.get('OrderDetail') as FormArray).push(poItemGroup);
        // }


        // this.onComputeAmount();
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
        // console.log('test');
        

        let TotalAmount = 0;
        let TotalQuantity = 0;

        for (let i = 0; i < this.poItems.length; i++) {
            
            const orderDetail = this.poItems.at(i);
        
            const quantity = orderDetail?.get('Quantity')!.value;
            const price = orderDetail?.get('UnitPrice')!.value;
            
            
            if (quantity && price) {
                const amount = quantity * price;
                TotalAmount += amount;
                TotalQuantity += quantity;
                orderDetail?.get('Amount')!.setValue(amount, { emitEvent: false }); // Disable emitting an event
            } else {
                orderDetail?.get('Amount')!.setValue(null, { emitEvent: false });
            }
            
        }

        this.rawMatsPOForm.patchValue({TotalQuantity: TotalQuantity});
        this.rawMatsPOForm.patchValue({TotalAmount: TotalAmount});
    }


    // onComputeAmount() {
    //     let TotalAmount = 0;
    //     let Quantity = 0;
    //     for (let i = 0; i < this.OrderDetail.length ; i++) {
    //         if (this.OrderDetail[i].Quantity && this.OrderDetail[i].UnitPrice) {
    //             this.OrderDetail[i].Amount = this.OrderDetail[i].Quantity * this.OrderDetail[i].UnitPrice;
    //             TotalAmount += this.OrderDetail[i].Quantity * this.OrderDetail[i].UnitPrice;
    //             Quantity += this.OrderDetail[i].Quantity;
    //         }
    //     }

    //     this.rawMatsPOForm.patchValue({TotalQuantity: Quantity});
    //     this.rawMatsPOForm.patchValue({TotalAmount: TotalAmount});
    // }

    getOrderItem(orderDetail: any) {
        return orderDetail
        .filter((item: any) => item.RawMaterial)  // Filter out items without RawMaterial
        .map((item: any) => item.RawMaterial!)   // Map to RawMaterial, using non-null assertion
        .join(', ');        
    }

}

interface ResponseData {

}