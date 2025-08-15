import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { BinloadService } from '../../binload.service';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-verify-request',
  templateUrl: './verify-request.component.html',
  styleUrls: ['./verify-request.component.css']
})
export class VerifyRequestComponent implements OnInit, OnDestroy{


  binloadVerifyForm!: FormGroup;
  binloadDetail!: FormGroup;
  visible: boolean = false;
  showForm: boolean = false;
  warehouseStock: any[] = [];
  warehouseStockVisible: boolean = false;

  @Input() plant: any[] = [];
  @Input() rawMaterial: any[] = [];
  @Input() warehouseLocation: any[] = [];
  @Input() warehouse: any[] = [];
  @Input() warehousePartition: any[] = [];
  @Input() unitOfMeasure: any[] = [];
  @Input() truck: any[] = [];
  @Input() driver: any[] = [];
  @Input() intake: any[] = [];
  @Input() UserID!: string;

  @Input() row: any;

  selectedStocks: any[] = [];


  isLoading: boolean = false;

  subscriptions: Subscription = new Subscription;

  constructor(
    private binloadService: BinloadService,
    private MessageService: MessageService
  ){}

  ngOnInit(): void {
    this.initiateForm();
    // console.log(this.row)
    // console.log(this.warehousePartition)
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  initiateForm() {
    
    this.binloadVerifyForm = new FormGroup({
      'BinloadRequestID': new FormControl(0),
      'WarehouseLocationID': new FormControl(null, Validators.required),
      'WarehouseID': new FormControl(null, Validators.required),
      'PO': new FormControl(null),
      'BL': new FormControl(null),
      'PlantID': new FormControl(null, Validators.required),
      'DriverID': new FormControl(null, Validators.required),
      'TruckID': new FormControl(null, Validators.required),
      'RequestDate': new FormControl(null, Validators.required),
      'RawMaterialID': new FormControl(null, Validators.required),
      'RequestQuantity': new FormControl(null, Validators.required),
      'BinloadUomID': new FormControl(null, Validators.required),
      'Status': new FormControl(0),
      'BinloadingDate': new FormControl(null, Validators.required),
      'BinloadingDateTime': new FormControl(null, Validators.required),
      'Quantity': new FormControl(null, Validators.required),
      'Weight': new FormControl(null, Validators.required),
      'IntakeID': new FormControl(null, Validators.required),
      'BinloadDetail': new FormArray([
        // new FormGroup({
        //   itemName: new FormControl('', Validators.required),
        //   quantity: new FormControl(0, [Validators.required, Validators.min(1)])
        // })
      ]),
      'UserID': new FormControl(null),
    })

    if (this.row) {
      this.binloadVerifyForm.patchValue({
        BinloadRequestID: this.row.BinloadRequestID,
        WarehouseLocationID: this.row.WarehouseLocationID,
        WarehouseID: this.row.WarehouseID,
        PO: this.row.PO,
        BL: this.row.BL,
        PlantID: this.row.PlantID,
        DriverID: this.row.DriverID,
        TruckID: this.row.TruckID,
        RequestDate: new Date(this.row.RequestDate.date),
        RawMaterialID: this.row.RawMaterialID,
        RequestQuantity: this.row.Quantity,
        BinloadUomID: this.row.BinloadUomID,
        Status: this.row.Status,
        BinloadingDate: new Date(this.row.Binloading[0].BinloadingDate.date),
        BinloadingDateTime: new Date(this.row.Binloading[0].BinloadingDateTime.date),
        Quantity: this.row.Binloading[0].Quantity,
        Weight: this.row.Binloading[0].Weight,
        IntakeID: this.row.Binloading[0].IntakeID,
        UserID: 0
      })
    }
    
  }


  showDialog(dialog: Dialog) {
    this.selectedStocks = [];
    this.visible = true;
    dialog.maximize();
  }

  addBinloadItem() {

    const control = <FormArray>this.binloadVerifyForm.controls['BinloadDetail'];

    control.push(
      new FormGroup({
        itemName: new FormControl('', Validators.required),
        quantity: new FormControl(0, [Validators.required, Validators.min(1)])
      })
    )

  }

  removeBinloadItem(index: number) {
    // const control = <FormArray>this.binloadVerifyForm.controls['BinloadDetail'];
    // control.removeAt(index);
    this.selectedStocks.splice(index, 1);
  }


  getPartition() {
    return this.warehousePartition = this.warehousePartition.filter(partition => partition.WarehouseID === this.row.WarehouseID)
  }


  onSelectPartition(eventValue: any) {
    this.subscriptions.add(
      this.binloadService.getRawMatsPartitionStock(this.row.RawMaterialID).subscribe(
        response => {
  
          const data = response.filter((stock: any) => stock.WarehouseID === this.row.WarehouseID && stock.WarehousePartitionID === eventValue)
          // console.log(data)
        }, 
        error => {
          console.log(error);
        }
      )
    )
  }

  showPartitionStock() {

    if (!this.binloadVerifyForm.value.RawMaterialID) {
      alert('No selected raw material')
    }

    const rawmatsValue = this.binloadVerifyForm.value.RawMaterialID;

    this.warehouseStockVisible = true

    this.subscriptions.add(
      this.binloadService.getRawMatsPartitionStockVerify(rawmatsValue).subscribe(
        response => {
          const data = response.filter((stock: any) => stock.WarehouseID == this.row.WarehouseID)
          // console.log(response)
          // console.log(this.row.WarehouseID)
          this.warehouseStock = data.map((stock: any) => ({...stock,BinloadingID: 0, BinloadingVerifyID: 0, Quantity: 0, Weight: 0})).filter((stock: any) => (
            !this.selectedStocks.some(selectedStock=> selectedStock.WarehousePartitionStockID === stock.WarehousePartitionStockID)
          ))
        }, 
        error => {
          console.log(error);
        }
      )
    )

  }

  onSubmit() {
    console.log(this.binloadVerifyForm.value)
    // console.log(this.selectedStocks)

    const data = {
      BinloadRequestID: this.binloadVerifyForm.value.BinloadRequestID,
      IntakeID: this.binloadVerifyForm.value.IntakeID,
      PlantID: this.binloadVerifyForm.value.PlantID,
      BinloadingDate: this.binloadVerifyForm.value.BinloadingDate.toLocaleDateString(),
      BinloadingDateTime: this.binloadVerifyForm.value.BinloadingDateTime.toLocaleString(),
      Status: this.binloadVerifyForm.value.Status,
      CheckerID: this.binloadVerifyForm.value.UserID,
      RequestDate: this.binloadVerifyForm.value.RequestDate.toLocaleDateString(),
      UserID: this.UserID,
      BinloadingDetails: this.selectedStocks
    }

    console.log(data)

    this.isLoading = true;

    this.binloadService.verifyStock(data).subscribe(
      response => {
        console.log(response);
        this.isLoading = false;

        if( response === 1) {

          this.MessageService.add({ 
              severity: 'success', 
              summary: 'Success', 
              detail: 'Successfully verified!', 
              life: 3000 
          });
          this.visible = false;

        } else if( response === 2) {

          this.MessageService.add({ 
              severity: 'success', 
              summary: 'Success', 
              detail: 'Successfully verified!', 
              life: 3000 
          });
          this.visible = false;

        } 
        
      },
      error =>{ 
        console.error(error)
        this.isLoading = false
      }
    )

    console.log(data)
    // console.log(this.selectedStocks)

  }

}
