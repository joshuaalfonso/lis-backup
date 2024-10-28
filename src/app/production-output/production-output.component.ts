import { Component, OnDestroy, OnInit, resolveForwardRef } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ProductionOutputService } from "./production-output.service";
import { Observable, Subscription } from "rxjs";
import { MessageService } from "primeng/api";
import { WarehouseService } from "../warehouse/warehouse.service";
import { WarehousePartitionService } from "../warehouse-partition/warehouse-partition.service";
import { FinishProductService } from "../finish-product/finish-product.service";
import { AuthService } from "../auth/auth.service";
import { UsersService } from "../users/users.service";




@Component({
    selector: 'app-production-output',
    templateUrl: 'production-output.component.html',
    styleUrls: ['production-output.component.css']
})
export class ProductionOutputComponent implements OnInit, OnDestroy {

    productionOutput: any[] = [];

    productionOutputForm!: FormGroup;

    isLoading: boolean = false;
    
    visible: boolean = false;

    dialogHeader: string = '';

    warehouse: any[] = [];

    warehousePartition: any[] = [];

    selectedPartition: any[] = [];

    plant: any[] = [];

    finishProduct: any[] = [];

    view: boolean = false;
    insert: boolean = false;
    edit: boolean = false;
    generateReport: boolean = false;

    private subscription: Subscription = new Subscription();

    constructor(
        private ProductionOutputService: ProductionOutputService,
        private MessageService: MessageService,
        private WarehouseService: WarehouseService,
        private WarehousePartitionService: WarehousePartitionService,
        private FinishProductService: FinishProductService,
        private auth: AuthService,
        private UsersService: UsersService
    ) {}

    ngOnInit(): void {
        this.productionOutputForm = new FormGroup({
            'ProductionOutputID': new FormControl(0),
            'PlantID': new FormControl(null, Validators.required),
            'LineNumber': new FormControl(null, Validators.required),
            'FinishProductID': new FormControl(null, Validators.required),
            'WarehouseID': new FormControl(null, Validators.required),
            'WarehousePartitionID': new FormControl(null, Validators.required),
            'DateTimeOutput': new FormControl(null, Validators.required),
            'DateOutput': new FormControl(null, Validators.required),
            'Quantity': new FormControl(null, Validators.required),
            'Weight': new FormControl(null, Validators.required),
            'UserID': new FormControl(0)
        })

        this.subscription.add(
            this.auth.user.subscribe(
                user => {
                    this.getUserAccess(user!.user_id);
                }
            )
        )

        this.getData(); 
        this.getFinishProduct();
        this.getPlant();
        this.getWarehouse();
        this.getPartition();
    }

    getUserAccess(UserID: string) {
        this.subscription.add(
            this.UsersService.getUserAccess(UserID).subscribe(
                response => {
                    let userRights = response;
                
                    for (let i = 0; i < userRights.length; i++) {
                        switch (userRights[i].AccessRight) {
                            case 27.1:
                                this.view = true;
                                break;
                            case 27.2:
                                this.insert = true;
                                break;
                            case 27.3:
                                this.edit = true;
                                break;
                            case 27.4:
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
            this.ProductionOutputService.getProductionOutputData().subscribe(
                response => {
                    this.productionOutput = response;
                    // console.log(response)
                    this.isLoading = false;
                }
            )
        )

    }

    getWarehouse() {
        this.subscription.add(
            this.WarehouseService.getWarehouseData().subscribe(
                response => {
                    this.warehouse = response;
                    for (let i = 0; i <= this.warehouse.length -1; i++) {
                        this.warehouse[i] = {...this.warehouse[i], LocationName: `${this.warehouse[i].WarehouseLocation} - ${this.warehouse[i].Warehouse_Name}`}
                    }
                }
            )
        )
    }

    getPartition() {
        this.subscription.add(
            this.WarehousePartitionService.getWarehousePartitionData().subscribe(
                response => {
                    this.warehousePartition = response;
                }
            )
        )
    }

    getPlant() {
        this.subscription.add(
            this.ProductionOutputService.getPlant().subscribe(
                response => {
                    this.plant = response;
                    // console.log(response)
                }
            )
        )
    }

    getFinishProduct() {
        this.subscription.add(
            this.FinishProductService.getFinishProductData().subscribe(
                response => {
                    this.finishProduct = response;
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
        this.clearItems();
        this.dialogHeader = 'Add Production Output';
    }

    clearItems() {
        this.productionOutputForm.reset();
        this.productionOutputForm.patchValue({ProductionOutputID: 0, UserID: 0})
    }

    onSubmit() {
        let authObs:Observable<ResonseData>;
        authObs = this.ProductionOutputService.saveData
        (
            this.productionOutputForm.value.ProductionOutputID,
            this.productionOutputForm.value.PlantID.PlantID,
            this.productionOutputForm.value.LineNumber,
            this.productionOutputForm.value.FinishProductID.FinishProductID,
            this.productionOutputForm.value.WarehouseID.WarehouseID,
            this.productionOutputForm.value.WarehousePartitionID.WarehousePartitionID,
            this.productionOutputForm.value.DateTimeOutput.toLocaleString(),
            this.productionOutputForm.value.DateOutput.toLocaleDateString(),
            this.productionOutputForm.value.Quantity,
            this.productionOutputForm.value.Weight,
            this.productionOutputForm.value.UserID,
        )

        authObs.subscribe(response =>{

            if( response === 1) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.productionOutputForm.value.FinishProductID.FinishProduct +  ' successfully recorded', life: 3000 });
                this.getData();
                this.clearItems();
            } 
            else if ( response === 2) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.productionOutputForm.value.FinishProductID.FinishProduct +  ' successfully updated', life: 3000 });
                this.getData();
                this.clearItems();
            }
            else if ( response === 0) {
                this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.productionOutputForm.value.FinishProductID.FinishProduct +  ' already exist', life: 3000 });
            }
            
        }, errorMessage => {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        })
    }

    findObjectByID( selectedID: number, idName: string, array: any[]) {
        for (let i = 0; i <= array.length -1; i++) {
            if (selectedID === array[i][idName]) {
                return array[i];
            }
        }
        return null; 
    }

    onSelect(data: any) {

        this.showDialog();
        this.dialogHeader = 'Edit Production Output';

        let WarehouseValue = this.findObjectByID(data.WarehouseID, 'WarehouseID', this.warehouse);

        let WarehousePartitionValue = this.findObjectByID(data.WarehousePartitionID, 'WarehousePartitionID', this.warehousePartition);

        let PlantValue = this.findObjectByID(data.PlantID, 'PlantID', this.plant);

        let FinishProductValue = this.findObjectByID(data.FinishProductID, 'FinishProductID', this.finishProduct);

        this.productionOutputForm.setValue({
            ProductionOutputID: data.ProductionOutputID,
            PlantID: PlantValue,
            LineNumber: data.LineNumber,
            FinishProductID: FinishProductValue,
            WarehouseID: WarehouseValue,
            WarehousePartitionID: WarehousePartitionValue,
            DateTimeOutput: new Date(data.DateTimeOutput.date),
            DateOutput: new Date( data.DateOutput.date),
            Quantity: data.Quantity,
            Weight: data.Weight,
            UserID: data.UserID 
        })

    }

    onSelectWarehouse(data: any) {
        if (data) {
            this.selectedPartition = [];

            for (let i = 0; i <= this.warehousePartition.length -1; i++) {
                if (data.WarehouseID == this.warehousePartition[i].WarehouseID) {
                    this.selectedPartition.push(this.warehousePartition[i])
                }
            }

        }
    }

}

interface ResonseData {

}