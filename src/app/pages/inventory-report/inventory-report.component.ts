import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { InventoryReportService } from './inventory-report.service';
import { RawMaterialsService } from 'src/app/raw-materials/raw-materials.service';



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
  selector: 'app-inventory-report',
  templateUrl: './inventory-report.component.html',
  styleUrls: ['./inventory-report.component.css']
})


export class InventoryReportComponent implements OnInit, OnDestroy{

  inventory: any[] = [];
  isLoading: boolean = false;
  subscriptions: Subscription = new Subscription;


  dateFrom = new Date();
  dateTo = new Date();

  rawMaterial: any[] = [];

  cols: Column[] = [];

  exportColumns: ExportColumn[] = [];

  constructor(
    private inventoryReportService: InventoryReportService,
    private rawMaterialService: RawMaterialsService
  ) {}

  ngOnInit(): void {
    this.getInventoryReport();
    this.getRawMaterial();


    this.cols = [
      { field: 'RawMaterial', header: 'Raw Material' },
      { field: 'Category', header: 'Category' },
      { field: 'Unloading_Weight', header: 'Unloading Weight' },
      { field: 'Binload_Weight', header: 'Binload Weight' },
      { field: 'RawMaterialStock', header: 'RawMaterial Stock' },
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getInventoryReport() {
    this.isLoading = true;
    this.subscriptions.add(
      this.inventoryReportService.getRawMaterialInventoryReport(this.formatDate(this.dateFrom), this.formatDate(this.dateTo)).subscribe(
      // this.inventoryReportService.getRawMaterialInventoryReport(this.dateFrom.toLocaleString(),this.dateTo.toLocaleString()).subscribe(
        response => {
          // console.log(response);
          this.inventory = response;
          this.isLoading = false;
        },
        error => {
          console.log(error);
          this.isLoading = false;
        }
      )
    )
  }

  // formatDate(date: any) {
  //   const d = new Date(date);
  //   const year = d.getFullYear();
  //   const month = ('0' + (d.getMonth() + 1)).slice(-2);
  //   const day = ('0' + d.getDate()).slice(-2);
  //   return year + '-' + month + '-' + day;
  // }

  formatDate(date: any) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const hours = ('0' + d.getHours()).slice(-2);
    const minutes = ('0' + d.getMinutes()).slice(-2);
    const seconds = ('0' + d.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  onFilterChange() {
    
    if (this.dateFrom && this.dateTo) {
      this.getInventoryReport();
    }

  }

  getRawMaterial() {
    this.subscriptions.add(
        this.rawMaterialService.getRawMatsData().subscribe(
            (response) => {
                this.rawMaterial = response;
                // console.log(response)
            }
        )
    )
}

}
