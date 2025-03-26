import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { RawMatsPOService } from '../../rawmats-po.service';
import { MessageService } from 'primeng/api';
import { RawMaterialPO } from '../../rawmats-po.model';

@Component({
  selector: 'app-rawmats-po-modal',
  templateUrl: './rawmats-po-modal.component.html',
  styleUrls: ['./rawmats-po-modal.component.css']
})
export class RawmatsPoModalComponent implements OnChanges{

  @Input() visible: boolean = false;
  @Input() rawMaterial: any[] = [];
  @Input() supplier: any[] = [];
  @Input() selectedPO: any;
  @Input() userID: any;
  @Output() closeModal = new EventEmitter<void>();
  @Output() getData = new EventEmitter<void>();


  submitLoading: boolean = false;
  rawMatsPOForm: FormGroup = new FormGroup({
    'PurchaseOrderID': new FormControl(0),
    'PONo': new FormControl(null, Validators.required),
    'PODate': new FormControl(null, Validators.required),
    'DeliveryDate': new FormControl(null, Validators.required),
    'PRNumber': new FormControl(null, Validators.required),
    'SupplierID': new FormControl(null, Validators.required),
    'RawMaterialID': new FormControl(null, Validators.required),
    'Weight': new FormControl(null, Validators.required),
    'UnitPricePerKilo': new FormControl(null),
    'Remarks': new FormControl(null),
    'deleted': new FormControl(null),
    'UserID': new FormControl(0),
  })

  constructor (
    private RawMatsPOService: RawMatsPOService,
    private messageService: MessageService
  ) {}

  ngOnChanges(): void {

    if (this.selectedPO) {
      
      const { 
        PurchaseOrderID, 
        PONo, 
        PODate, 
        DeliveryDate, 
        PRNumber, 
        SupplierID, 
        RawMaterialID, 
        Weight, 
        UnitPricePerKilo,
        Remarks,
        deleted,
        UserID
      } = this.selectedPO;

      this.rawMatsPOForm.setValue({
        PurchaseOrderID: PurchaseOrderID,
        PONo: PONo,
        PODate: new Date(PODate.date),
        DeliveryDate: new Date(DeliveryDate.date),
        PRNumber: PRNumber,
        SupplierID: SupplierID,
        RawMaterialID: RawMaterialID,
        Weight: Weight,
        UnitPricePerKilo: UnitPricePerKilo,
        Remarks: Remarks,
        deleted: deleted,
        UserID: UserID
      })
      
    } else {
      this.rawMatsPOForm.reset({
        PurchaseOrderID: 0,
        PONo: null,
        PODate: null,
        DeliveryDate: null,
        PRNumber: null,
        SupplierID: null,
        RawMaterialID: null,
        Weight: null,
        UnitPricePerKilo: null,
        Remarks: null,
        deleted: null,
        UserID: 0
      })
    }

  }

  onSubmit() {
    
    if (!this.rawMatsPOForm.valid) {
      alert('please all the blanks')
    }

    const { 
      PurchaseOrderID, 
      PONo, 
      PODate, 
      DeliveryDate, 
      PRNumber, 
      SupplierID, 
      RawMaterialID, 
      Weight, 
      UnitPricePerKilo,
      Remarks,
      deleted,
    } = this.rawMatsPOForm.value;

    const data: RawMaterialPO = {
      PurchaseOrderID: PurchaseOrderID,
      PONo: PONo,
      PODate: PODate.toLocaleDateString(),
      DeliveryDate: DeliveryDate.toLocaleDateString(),
      PRNumber: PRNumber,
      SupplierID: SupplierID,
      RawMaterialID: RawMaterialID,
      Weight: Weight,
      UnitPricePerKilo: UnitPricePerKilo,
      Remarks: Remarks,
      deleted: deleted,
      UserID: this.userID
    }
    
    this.submitLoading = true;

    let authObs: Observable<ResponseData>;
    authObs = this.RawMatsPOService.savedata
    (
      data
    )

    authObs.subscribe(response =>{
      this.submitLoading = false;

      if( response === 1) {
          this.messageService.add({ 
              severity: 'success', 
              summary: 'Success', 
              detail: 'Successfully Recorded!', 
              life: 3000 
          });
          this.getData.emit();
          this.closeModal.emit();
      } 
      else if ( response === 2) {
          this.messageService.add({ 
              severity: 'success', 
              summary: 'Success', 
              detail: 'Successfully Updated!', 
              life: 3000 
          });
          this.getData.emit();
          this.closeModal.emit();
      }
      else if ( response === 0) {
          this.messageService.add({ 
              severity: 'error', 
              summary: 'Danger', 
              detail: 'Item: ' + this.rawMatsPOForm.value.PONo +  ' already exist', 
              life: 3000 
          });
      }
        
    }, 
    errorMessage => {
      this.submitLoading = false;
      this.messageService.add({ 
          severity: 'error', summary: 'Danger', 
          detail: errorMessage, 
          life: 3000 
      });
    })
  }
}

interface ResponseData {

}