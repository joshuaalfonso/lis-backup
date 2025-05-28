import { Component, EventEmitter, Input, OnDestroy, OnInit, Output,  } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BinloadRequest, BinloadService } from '../../binload.service';
import { MessageService } from 'primeng/api';

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
  @Input() UserID!: string;

  @Output() getBinloadRequest = new EventEmitter();

  warehouseStock: any[] = [];

  subscription: Subscription = new Subscription;


  constructor(
    private BinloadService: BinloadService,
    private MessageService: MessageService
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
      'UserID': new FormControl(this.UserID),
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
      this.BinloadService.getDispatcherStock(rawMaterialID).subscribe(
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
    // console.log(this.binloadRequestForm.value)

    const binloadRequestFormValue = {
      BinloadRequestID: this.binloadRequestForm.value.BinloadRequestID,
      WarehouseLocationID: this.binloadRequestForm.value.WarehouseLocationID,
      WarehouseID: this.binloadRequestForm.value.WarehouseID,
      WarehousePartitionID: this.binloadRequestForm.value.WarehousePartitionID,
      // WarehousePartitionStockID: this.binloadRequestForm.value.WarehousePartitionStockID,
      // PO: this.binloadRequestForm.value.PO,
      // BL: this.binloadRequestForm.value.BL,
      PlantID: this.binloadRequestForm.value.PlantID,
      DriverID: this.binloadRequestForm.value.DriverID,
      TruckID: this.binloadRequestForm.value.TruckID,
      RequestDate: this.binloadRequestForm.value.RequestDate.toLocaleDateString(),
      RawMaterialID: this.binloadRequestForm.value.RawMaterialID,
      Quantity: this.binloadRequestForm.value.Quantity,
      BinloadUomID: this.binloadRequestForm.value.BinloadUomID,
      Status: 0,
      UserID: this.UserID,
    }

    // console.log(binloadRequestFormValue)

    this.BinloadService.insertBinloadRequest(binloadRequestFormValue).subscribe(
      response => {

        this.requestSubmitLoading = false;

        if( response === 1) {

          this.MessageService.add({ 
              severity: 'success', 
              summary: 'Success', 
              detail: 'Successfully created!', 
              life: 3000 
          });

          this.getBinloadRequest.emit();
          this.visibleRequestModal = false;
        } 

        else if ( response === 2) {

          this.MessageService.add({ 
              severity: 'success', 
              summary: 'Success', 
              detail: 'Successfully updated!', 
              life: 3000 
          });

          this.getBinloadRequest.emit();
          
          this.visibleRequestModal = false;
        }
        else if ( response === 0) {

          this.MessageService.add({ 
              severity: 'error', 
              summary: 'Danger', 
              detail: 'Item: ' + this.binloadRequestForm.value.BinloadingID +  ' already exist', life: 3000 
          });

        }
          
      }, errorMessage => {                
        this.requestSubmitLoading = false;

        this.MessageService.add({ 
            severity: 'error', 
            summary: 'Danger', 
            detail: errorMessage, 
            life: 3000 
        });

      }
    )
  }

}



