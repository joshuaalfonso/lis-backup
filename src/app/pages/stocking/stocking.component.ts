import { Component, OnDestroy, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { RawMaterialsService } from 'src/app/raw-materials/raw-materials.service';
import { StockingService } from './stocking.service';

@Component({
  selector: 'app-stocking',
  templateUrl: './stocking.component.html',
  styleUrls: ['./stocking.component.css']
})
export class StockingComponent implements OnInit, OnDestroy{

  rawMaterials: any[] = [];
  isLoading: boolean = false;

  subscriptions: Subscription = new Subscription;

  constructor(
    private rawMaterialService: RawMaterialsService,
    private stockingService: StockingService
  ) {}

  ngOnInit(): void {

    this.getRawMaterials();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getRawMaterials() {
    this.isLoading = true;
    this.subscriptions.add(
      this.stockingService.getStocking().subscribe(
        response => {
          this.isLoading = false;
          this.rawMaterials = response
        },
        error => {
          this.isLoading = false;
          console.error(error)
        }
      )
    )
  }

  onGlobalFilter(table: Table, event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    table.filterGlobal(inputValue, 'contains');
  }

}
