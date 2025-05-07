import { Component, Input, OnDestroy, OnInit,  } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BinloadService } from '../../binload.service';

@Component({
  selector: 'app-add-request',
  templateUrl: './add-request.component.html',
  styleUrls: ['./add-request.component.css']
})
export class AddRequestComponent implements OnInit, OnDestroy{

  visibleRequestModal: boolean = false;
  requestSubmitLoading: boolean = false;
  warehouseStockVisible: boolean = false;

  binloadRequestForm!: FormGroup;

  selectedWarehouse: any;

  @Input() plant: any[] = [];
  @Input() rawMaterial: any[] = [];
  @Input() warehouseLocation: any[] = [];
  @Input() warehouse: any[] = [];
  @Input() unitOfMeasure: any[] = [];
  @Input() truck: any[] = [];
  @Input() driver: any[] = [];

  warehouseStock: any[] = [];

  subscription: Subscription = new Subscription;

  constructor(
    private BinloadService: BinloadService
  ){}

  ngOnInit(): void {
    
    this.initiateForm();

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initiateForm() {

    this.binloadRequestForm = new FormGroup({
      'BinloadRequestID': new FormControl(0),
      'WarehouseLocationID': new FormControl(null, Validators.required),
      'WarehouseID': new FormControl(null, Validators.required),
      // 'WarehousePartitionID': new FormControl(null, Validators.required),
      // 'WarehousePartitionStockID': new FormControl(null, Validators.required),
      'PO': new FormControl(null),
      'BL': new FormControl(null),
      'PlantID': new FormControl(null, Validators.required),
      'DriverID': new FormControl(null, Validators.required),
      'TruckID': new FormControl(null, Validators.required),
      'RequestDate': new FormControl(null, Validators.required),
      'RawMaterialID': new FormControl(null, Validators.required),
      'Quantity': new FormControl(null, Validators.required),
      'BinloadUomID': new FormControl(null, Validators.required),
      'Status': new FormControl(0),
      'UserID': new FormControl(null),
    })

  }

  
  showRequestDialog(dialog: any) {
    dialog.maximize();
    this.visibleRequestModal = true;
  }


  onSelectRawMaterial(eventValue: any) {

    this.selectedWarehouse = null;

    if (!eventValue) return
    const rawMaterialID = eventValue;

    this.subscription.add(
      this.BinloadService.getWarehouseFilter(rawMaterialID).subscribe(
        response => {
          this.warehouseStockVisible = true;
          this.warehouseStock = response;
        },
        error => {
          console.log('Error :' + error)
        }
      )
    )

  }

  onSelectWarehouse() {

    let warehouseID = null;
    let WarehouseLocationID = null;

    if (this.selectedWarehouse) {
      warehouseID = this.selectedWarehouse.WarehouseID;
      WarehouseLocationID = this.selectedWarehouse.WarehouseLocationID;
    }

    this.binloadRequestForm.patchValue({
      WarehouseLocationID: WarehouseLocationID,
      WarehouseID: warehouseID
    })

  }

  onSelectLocation(data: any) {

  }


  onSubmitBinloadRequest() {
    console.log(this.binloadRequestForm.value)
  }

}



