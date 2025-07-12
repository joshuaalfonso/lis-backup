import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BinloadService } from '../binload/binload.service';
import { UnloadingTransactionService } from '../unloading-transaction/unloading-transaction.service';
import { ContractPerformaService } from '../contract-performa/contract-performa.service';
import { RawMaterialsService } from '../raw-materials/raw-materials.service';
import { MessageService } from 'primeng/api';
import { WarehouseLocationService } from '../pages/warehouse-location/warehouse-location.service';

@Component({
  selector: 'app-dashboard-warehousing',
  templateUrl: './dashboard-warehousing.component.html',
  styleUrls: ['./dashboard-warehousing.component.css']
})
export class DashboardWarehousingComponent implements OnInit, OnDestroy {

  @Input() isnightMode!: boolean;

  warehouseLocation: any[] = [];
  recentUnload: any[] = [];
  recentBinload: any[] = [];
  landedShipping: any[] = [];
  rawMaterial: any[] = [];

  cardsLoading: boolean = false;
  unloadLoading: boolean = false;
  binloadLoading: boolean = false;
  receivedLoading: boolean = false;
  rawmatsLoading: boolean = false;

  subscriptions: Subscription = new Subscription;

  selectedOption: number = 1;

  constructor(
    private WarehouseLocationService: WarehouseLocationService,
    private BinloadService: BinloadService,
    private UnloadingService: UnloadingTransactionService,
    private ContractPerformaService: ContractPerformaService,
    private RawMaterialService: RawMaterialsService,
    private MessageService: MessageService
  ) {}


  ngOnInit(): void {
    this.getWarehouseLocation();
    this.getRecentUnload();
    this.getRecentBinload();
    this.getLandedShipping();
    this.getRawMaterial();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  


  getWarehouseLocation() {
    this.cardsLoading = true;

    this.subscriptions.add(
      this.WarehouseLocationService.getWarehouseLocationData().subscribe(
        response => {
            this.cardsLoading = false;
            this.warehouseLocation = response;
        }, err => {
            console.log('err: ' + err);
        }
      )
    )

  }

  getRecentUnload() {
    this.unloadLoading = true;

    this.subscriptions.add(
      this.UnloadingService.getUnloadedToday().subscribe(
        response => {
          // console.log(response);
          
          this.recentUnload = response;
          this.unloadLoading = false;
            
        }, error => {
          console.error(error);
          this.unloadLoading = false;
        }
      )
    )
  }

  getRecentBinload() {
    this.binloadLoading = true;

    this.subscriptions.add(this.BinloadService.getRecentBinload().subscribe(
      (response) => {
        this.recentBinload = response;
      }, 
      (error) => {
        console.error('There was an error fetching recent binload' + error);
      }, 
      () => {
        this.binloadLoading = false;
      })
    )
  }

  getLandedShipping() {
    this.receivedLoading = true;

    this.subscriptions.add(
      this.ContractPerformaService.getReceived(0).subscribe(
          response => {
              this.receivedLoading = false;
              this.landedShipping = response.splice(0);
          }
      )
    )
  }

  getRawMaterial() {
    this.rawmatsLoading = true;

    this.subscriptions.add(
      this.RawMaterialService.getRawMatsData().subscribe(
          response => {
              this.rawmatsLoading = false;
              this.rawMaterial = response;
          }, err => {
              console.error(err);
              this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'There was an error fetching raw material' });
          }
      )
    )
  }

  tabChange(data: number) {
    this.selectedOption = data;
  }

}
