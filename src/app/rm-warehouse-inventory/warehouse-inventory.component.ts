import { Component, OnInit } from "@angular/core";
import { WarehouseInventoryService } from "./warehouse-inventory.service";
import { Subscription } from "rxjs";



@Component({
    selector: 'app-warehouse-inventory',
    templateUrl: 'warehouse-inventory.component.html',
    styleUrls: ['warehouse-inventory.component.css']
})
export class WarehouseInventoryComponent implements OnInit{

    rawMatsInventory: any[] = [];

    finishProdInventory: any[] = [];

    isLoading: boolean = false;

    stateOptions: any[] = [{ label: 'Raw Material', value: 1 },{ label: 'Finish Product', value: 2}];

    value: number = 1;

    private subscription: Subscription = new Subscription();

    constructor(
        private WarehouseInventoryService: WarehouseInventoryService
    ) {}

    ngOnInit(): void {
        this.getData();
    }

    getData() {
        if (this.value === 1) {
            this.isLoading = true;
            this.subscription.add(
                this.WarehouseInventoryService.getWarehouseInventoryData().subscribe(
                    response => {
                        this.rawMatsInventory = response;
                        this.isLoading = false;
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
                    }
                )
            )
        }
    }
}