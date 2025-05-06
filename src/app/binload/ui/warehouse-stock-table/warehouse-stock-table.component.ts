import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-warehouse-stock-table',
  templateUrl: './warehouse-stock-table.component.html',
  styleUrls: ['./warehouse-stock-table.component.css']
})
export class WarehouseStockTableComponent {

  @Input() warehouseStock: any[] = [];

}
