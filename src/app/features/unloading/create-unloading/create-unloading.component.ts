import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Subscription } from 'rxjs';
import { UnloadingTransactionService } from 'src/app/unloading-transaction/unloading-transaction.service';

@Component({
  selector: 'app-create-unloading',
  templateUrl: './create-unloading.component.html',
  styleUrls: ['./create-unloading.component.css']
})
export class CreateUnloadingComponent implements OnInit, OnDestroy{


  visible: boolean = false;

  unloadingTransactionForm!: FormGroup;

  po: any[] = [];

  maxDate: Date = new Date();

  subscriptions: Subscription = new Subscription;

  constructor(
    private unloadingTransactionService: UnloadingTransactionService
  ) {}

  ngOnInit(): void {

    this.unloadingTransactionForm = new FormGroup({
      'UnloadingTransactionID': new FormControl(0),
      'isTransactionID': new FormControl(0),
      'PO': new FormControl(null),
      'BL': new FormControl(null),
      'ContainerNumber': new FormControl(null),
      'DateTimeUnload': new FormControl(null),
      'DateUnload': new FormControl(null, Validators.required),
      'DrNumber': new FormControl(null, [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.minLength(2)]),
      'TruckID': new FormControl(null, Validators.required),
      'RawMaterialID': new FormControl(null, Validators.required),
      'WarehouseLocationID': new FormControl(null), 
      'WarehouseID': new FormControl(null, Validators.required),
      'WarehousePartitionID': new FormControl(null, Validators.required),
      'Quantity': new FormControl(null),
      'Weight': new FormControl(null),
      'SupplierID': new FormControl(null, Validators.required),
      'Status': new FormControl(0),
      'UserID': new FormControl(0),
    })

    this.getPO();
    
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getPO() {
    this.subscriptions.add(
      this.unloadingTransactionService.getPO().subscribe(
        response => {
            this.po = response;
        }
      )
    )
  }


  showDialog(dialog: Dialog) {
    this.visible = true;
    dialog.maximize()
  }


  onSubmit() {

  }

}
