import { Component, OnDestroy, OnInit } from "@angular/core";
import { WarehouseInventoryService } from "./warehouse-inventory.service";
import { Subscription, take } from "rxjs";
import { SystemLogsService } from "../pages/system-logs/system-logs.service";
import { AuthService } from "../auth/auth.service";
import { Message } from "primeng/api";

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
  }
  
  interface ExportColumn {
    title: string;
    dataKey: string;
  }

@Component({
    selector: 'app-warehouse-inventory',
    templateUrl: 'warehouse-inventory.component.html',
    styleUrls: ['warehouse-inventory.component.css']
})
export class WarehouseInventoryComponent implements OnInit, OnDestroy{

    rawMatsInventory: any[] = [];

    finishProdInventory: any[] = [];

    isLoading: boolean = false;

    warehouseInventoryError: Message[] = [];

    stateOptions: any[] = [{ label: 'Raw Material', value: 1 },{ label: 'Finish Product', value: 2}];

    value: number = 1;

    userID!: string;

    private subscription: Subscription = new Subscription();

    cols: Column[] = [];

    exportColumns: ExportColumn[] = [];

    constructor(
        private WarehouseInventoryService: WarehouseInventoryService,
        private SystemLogsService: SystemLogsService,
        private auth: AuthService
    ) {}

    ngOnInit(): void {

        this.getUser();
        this.getData();
        this.logWarehouseInventoryView();

        this.cols = [
            { field: 'FormattedInventoryDate', header: 'Date' },
            { field: 'RawMaterial', header: 'Raw Material' },
            { field: 'BeginQty', header: 'Begin Quantity' },
            { field: 'BeginWeight', header: 'Begin Weight' },
            { field: 'IncomingQty', header: 'Incoming Quantity' },
            { field: 'IncomingWeight', header: 'Incoming Weight' },
            { field: 'BinloadingQty', header: 'Outgoing Quantity' },
            { field: 'BinloadingWeight', header: 'Outgoing Weight' },
            { field: 'CondemQty', header: 'Condemned Quantity' },
            { field: 'CondemWeight', header: 'Condemned Weight' },
            { field: 'EndingQty', header: 'Ending Quantity' },
            { field: 'EndingWeight', header: 'Ending Weight' },
        ];
      
        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));

    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getUser() {
        this.auth.user.pipe(take(1)).subscribe(
            user => {
                if (user) {
                    this.userID = user.user_id;
                }
            }
        )
    }

    getData() {
        if (this.value === 1) {
            this.isLoading = true;
            this.subscription.add(
                this.WarehouseInventoryService.getWarehouseInventoryData().subscribe(
                    response => {
                        this.rawMatsInventory = response.map((item: any) => (
                            {...item, FormattedInventoryDate: new Date(item.InventoryDate.date).toLocaleDateString()}
                        ));
                        this.isLoading = false;
                    },
                    error => {
                        console.log(error);
                        this.isLoading = false;
                        this.warehouseInventoryError = [{ severity: 'error', detail: 'There wass an error fetching Inventory' }]
                    }
                )
            )
        } else if (this.value === 2) {
            this.isLoading = true;
            this.subscription.add(
                this.WarehouseInventoryService.getFpWarehouseInventoryData().subscribe(
                    response => {
                        this.finishProdInventory = response;
                        this.isLoading = false;
                    },
                    error => {
                        console.log(error);
                        this.isLoading = false;
                        this.warehouseInventoryError = [{ severity: 'error', detail: 'There wass an error fetching Inventory' }]
                    }
                )
            )
        }
    }

    logWarehouseInventoryView() {

        if (!this.userID) {
            alert('No logged in user');
            return
        }

        const data = {
            UserID: this.userID,
            TableName: 'Warehouse Inventory'
        }

        this.SystemLogsService.sytemLogView(data).pipe(take(1)).subscribe(
            response => {
                console.log(response);
            },
            error => {
                console.log(error);
                this.warehouseInventoryError = [{ severity: 'error', detail: 'An unkown error occured' }]
            }
        );

    }
}