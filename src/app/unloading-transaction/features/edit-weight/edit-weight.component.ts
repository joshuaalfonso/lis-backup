import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-weight',
  templateUrl: './edit-weight.component.html',
  styleUrls: ['./edit-weight.component.css']
})
export class EditWeightComponent implements OnInit {


  editWeightForm!: FormGroup;

  submitLoading: boolean = false;

  selectedPackaging: number = 0;
  
  @Input() selectedRow: any = {};
  @Input() value: number = 0;
  @Input() visible: boolean = false;
  @Input() po: any[] = [];
  @Input() bl: any[] = [];

  containerNumber: any[] = [];
  localSupplier: any[] = [];
  supplier: any[] = [];
  truck: any[] = [];
  warehouse: any[] = [];
  selectedWarehouse: any[] = [];
  rawMaterial: any[] = [];

  maxDate: Date = new Date();

  ngOnInit(): void {
    
    this.editWeightForm = new FormGroup({
      'UnloadingTransactionID': new FormControl(0),
      'isTransactionID': new FormControl(0),
      'PO': new FormControl(null),
      'BL': new FormControl(null),
      'ContainerNumber': new FormControl(null),
      'DateTimeUnload': new FormControl(null),
      'DateUnload': new FormControl(null),
      'DrNumber': new FormControl(null),
      'TruckID': new FormControl(null),
      'RawMaterialID': new FormControl(null),
      'WarehouseLocationID': new FormControl(null), 
      'WarehouseID': new FormControl(null),
      'WarehousePartitionID': new FormControl(null),
      'Quantity': new FormControl(null, Validators.required),
      'Weight': new FormControl(null, Validators.required),
      'SupplierID': new FormControl(null),
      'Status': new FormControl(0),
      'UserID': new FormControl(0),
    })

  }

  showEditWeightForm() {    
    this.visible = true;
  }


  onSubmit() {

  }

}
