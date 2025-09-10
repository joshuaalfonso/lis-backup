import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { take } from 'rxjs';
import { ShippingPost } from 'src/app/pages/importation/importation.model';
import { ImportationService } from 'src/app/pages/importation/importation.service';


@Component({
  selector: 'app-create-shipping-transaction',
  templateUrl: './create-shipping-transaction.component.html',
  styleUrls: ['./create-shipping-transaction.component.css']
})
export class CreateShippingTransactionComponent implements OnChanges{


  isSubmitting: boolean = false;

  @Input() shippingDialogVisisble: boolean = false;
  @Input() statusValue!: number;
  @Input() rawMaterial: any[] = [];
  @Input() supplier: any[] = [];
  @Input() shippingLine: any[] = [];
  @Input() containerType: any[] = [];
  @Input() broker: any[] = [];
  @Input() bank: any[] = [];
  @Input() row: any;
  @Input() UserID: any;

  @Output() getShippingTransaction= new EventEmitter();
  @Output() closeShippingDialog= new EventEmitter();

  @ViewChild('ShippingDialog') dialog!: Dialog;

  packaging = [
    {
        PackagingID: 1,
        Packaging: 'Containerized'
    },
    {
        PackagingID: 2,
        Packaging: 'Bulk'
    }
  ]


  shippingTransactionForm = new FormGroup({
    'ShippingTransactionID': new FormControl(0),
    'ContractPerformaID': new FormControl(null),
    'ContractNo': new FormControl(null),
    'Lot': new FormControl(null),
    // 'Served': new FormControl(null),
    // 'Balance': new FormControl(null),
    'RawMaterialID': new FormControl(null),
    'SupplierID': new FormControl(null),
    'SupplierAddress': new FormControl(null),
    'Packaging': new FormControl(0),
    'AdvanceDocumentsReceived': new FormControl(null as Date | null),
    'BAI_SPS_IC': new FormControl(null),
    'FromBAIValidity': new FormControl(null as Date | null),
    'ToBAIValidity': new FormControl(null as Date | null),
    'BPI_SPS_IC': new FormControl(null),
    'FromBPIValidity': new FormControl(null as Date | null),
    'ToBPIValidity': new FormControl(null as Date | null),
    'MBL': new FormControl(null),
    'BL': new FormControl(null),
    'ShippingLineID': new FormControl(null),
    'Vessel': new FormControl(null),
    'HBL': new FormControl(null),
    'Forwarder': new FormControl(null),
    'ETD': new FormControl(null as Date | null),
    'ETA': new FormControl(null as Date | null),
    'ATA': new FormControl(null as Date | null),
    'ContainerTypeID': new FormControl(0),
    'NoOfContainer': new FormControl(null),
    'NoOfTruck': new FormControl(null),
    'Quantity': new FormControl(null),
    'BrokerID': new FormControl(null),
    'DateDocsReceivedByBroker': new FormControl(null as Date | null),
    'BAI_SPS_IC_Date': new FormControl(null as Date | null),
    'BPI_SPS_IC_Date': new FormControl(null as Date | null),
    'OriginalDocsAvailavilityDate': new FormControl(null as Date | null),
    'BankID': new FormControl(null),
    'DateOfPickup': new FormControl(null as Date | null),
    'PortOfDischarge': new FormControl(null),
    'Status': new FormControl(null),
    'DateOfDischarge': new FormControl(null as Date | null),
    'LodgementDate': new FormControl(null as Date | null),
    'LodgementBankID': new FormControl(null),
    'GatepassRecieved': new FormControl(null as Date | null),
    'AcknowledgeByLogistics': new FormControl(null as Date | null),
    'StorageLastFreeDate': new FormControl(null as Date | null),
    'DemurrageDate': new FormControl(null as Date | null),
    'DetentionDate': new FormControl(null as Date | null),
    'Remarks': new FormControl(null),
    'UserID': new FormControl(null),
  });



  constructor(
    private importationService: ImportationService,
    private messageService: MessageService
  ) {}


  ngOnChanges(): void {
    if (this.row?.ShippingTransactionID && this.row?.ContractPerformaID) {
      console.log(this.row.ShippingTransactionID, this.row?.ContractPerformaID)
      this.shippingTransactionForm.patchValue({
        // ContractPerformaID: this.row.ContractPerformaID,
        // ContractNo: this.row.ContractNo,
        // RawMaterialID: this.row.RawMaterialID,
        // SupplierID: this.row.SupplierID,
        // SupplierAddress: this.row.SupplierAddress,
        // Packaging: this.row.Packaging

        ShippingTransactionID:  this.row.ShippingTransactionID || 0,
        ContractPerformaID: this.row.ContractPerformaID,
        ContractNo: this.row.ContractNo,
        Lot: this.row.Lot,
        RawMaterialID:  this.row.RawMaterialID,
        SupplierID: this.row.SupplierID,
        SupplierAddress: this.row.SupplierAddress,
        Packaging: this.row.Packaging,
        AdvanceDocumentsReceived: this.row.AdvanceDocumentsReceived?.date ? new Date(this.row.AdvanceDocumentsReceived?.date) : null,
        BAI_SPS_IC: this.row.BAI_SPS_IC,
        FromBAIValidity: this.row.FromBAIValidity?.date ? new Date(this.row.FromBAIValidity?.date) : null,
        ToBAIValidity: this.row.ToBAIValidity?.date ? new Date(this.row.ToBAIValidity.date) : null,
        BPI_SPS_IC: this.row.BPI_SPS_IC || null,
        FromBPIValidity: this.row.FromBPIValidity?.date ? new Date(this.row.FromBPIValidity?.date) : null,
        ToBPIValidity: this.row.ToBPIValidity?.date ? new Date(this.row.ToBPIValidity?.date) : null,
        MBL: this.row.MBL || null,
        BL: this.row.BL || null,
        ShippingLineID:this.row.ShippingLineID || null,
        Vessel: this.row.Vessel || null,
        HBL: this.row.HBL || null,
        Forwarder: this.row.Forwarder || null,
        ETD: this.row.ETD?.date ? new Date(this.row.ETD?.date) : null,
        ETA: this.row.ETA?.date ? new Date(this.row.ETA?.date) : null,
        ATA: this.row.ATA?.date ? new Date(this.row.ATA?.date) : null,
        ContainerTypeID: this.row.ContainerTypeID || null,
        NoOfContainer: this.row.NoOfContainer || null,
        NoOfTruck: this.row.NoOfTruck || null,
        Quantity: this.row.Quantity || null,
        BrokerID: this.row.BrokerID || null,
        DateDocsReceivedByBroker:  this.row.DateDocsReceivedByBroker?.date ? new Date(this.row.DateDocsReceivedByBroker?.date) : null,
        BAI_SPS_IC_Date:  this.row.BAI_SPS_IC_Date?.date ? new Date(this.row.BAI_SPS_IC_Date?.date) : null,
        BPI_SPS_IC_Date: this.row.BPI_SPS_IC_Date?.date ? new Date(this.row.BPI_SPS_IC_Date?.date) : null,
        OriginalDocsAvailavilityDate:  this.row.OriginalDocsAvailavilityDate?.date ? new Date(this.row.OriginalDocsAvailavilityDate?.date) : null,
        BankID: this.row.BankID || null,
        DateOfPickup: this.row.DateOfPickup?.date ? new Date(this.row.DateOfPickup?.date) : null,
        PortOfDischarge: this.row.PortOfDischarge || null,
        Status:  typeof this.row.Status === 'number' ? this.row.Status : 1,
        DateOfDischarge: this.row.DateofDischarge?.date ? new Date(this.row.DateofDischarge?.date) : null,
        LodgementDate: this.row.LodgementDate?.date ? new Date(this.row.LodgementDate?.date) : null,
        LodgementBankID: this.row.LodgementBankID || null,
        GatepassRecieved: this.row.GatepassRecieved?.date ? new Date(this.row.GatepassRecieved?.date) : null,
        AcknowledgeByLogistics: this.row.AcknowledgeByLogistics?.date ? new Date(this.row.AcknowledgeByLogistics?.date) : null,
        StorageLastFreeDate: this.row.StorageLastFreeDate?.date ? new Date(this.row.StorageLastFreeDate?.date) : null,
        DemurrageDate: this.row.DemurrageDate?.date ? new Date(this.row.DemurrageDate?.date) : null,
        DetentionDate:this.row.DetentionDate?.date ? new Date(this.row.DetentionDate?.date) : null,
        Remarks: this.row.Remarks || null,
        UserID: this.row.UserID,
      })
    } 
    
    else if (this.row?.ContractPerformaID && !this.row?.ShippingTransactionID) {
      this.shippingTransactionForm.patchValue({
        ContractPerformaID: this.row.ContractPerformaID,
        ContractNo: this.row.ContractNo,
        RawMaterialID: this.row.RawMaterialID,
        SupplierID: this.row.SupplierID,
        SupplierAddress: this.row.SupplierAddress,
        Packaging: this.row.Packaging
      })
    }
    
    else {
      this.shippingTransactionForm.reset({
        ShippingTransactionID: 0
      });
      // console.log(this.shippingTransactionForm.value)
    }

  }

  maximize() {
    this.dialog.maximize();
  }

  onSubmit() {
    // console.log(this.shippingTransactionForm.value.AdvanceDocumentsReceived?.toLocaleDateString() || null)
    const data: ShippingPost = {
      ShippingTransactionID:  this.shippingTransactionForm.value.ShippingTransactionID || 0,
      ContractPerformaID: this.shippingTransactionForm.value.ContractPerformaID ?? 0,
      Lot: this.shippingTransactionForm.value.Lot || null,
      RawMaterialID:  this.shippingTransactionForm.value.RawMaterialID || 0,
      SupplierID: this.shippingTransactionForm.value.SupplierID || 0,
      Packaging: this.shippingTransactionForm.value.Packaging || 0,
      AdvanceDocumentsReceived: this.shippingTransactionForm.value.AdvanceDocumentsReceived?.toLocaleDateString() || null,
      BAI_SPS_IC: this.shippingTransactionForm.value.BAI_SPS_IC || null,
      FromBAIValidity: this.shippingTransactionForm.value.FromBAIValidity?.toLocaleDateString() || null,
      ToBAIValidity: this.shippingTransactionForm.value.ToBAIValidity?.toLocaleDateString() || null,
      BPI_SPS_IC: this.shippingTransactionForm.value.BPI_SPS_IC || null,
      FromBPIValidity: this.shippingTransactionForm.value.FromBPIValidity?.toLocaleDateString() || null,
      ToBPIValidity: this.shippingTransactionForm.value.ToBPIValidity?.toLocaleDateString() || null,
      MBL: this.shippingTransactionForm.value.MBL || null,
      BL: this.shippingTransactionForm.value.BL || null,
      ShippingLineID: this.shippingTransactionForm.value.ShippingLineID || null,
      Vessel: this.shippingTransactionForm.value.Vessel || null,
      HBL: this.shippingTransactionForm.value.HBL || null,
      Forwarder: this.shippingTransactionForm.value.Forwarder || null,
      ETD:  this.shippingTransactionForm.value.ETD?.toLocaleDateString() || null,
      ETA: this.shippingTransactionForm.value.ETA?.toLocaleDateString() || null,
      ATA: this.shippingTransactionForm.value.ATA?.toLocaleDateString() || null,
      ContainerTypeID: this.shippingTransactionForm.value?.ContainerTypeID || null,
      NoOfContainer: this.shippingTransactionForm.value.NoOfContainer || null,
      NoOfTruck: this.shippingTransactionForm.value.NoOfTruck || null,
      Quantity: this.shippingTransactionForm.value.Quantity || null,
      BrokerID: this.shippingTransactionForm.value.BrokerID || null,
      DateDocsReceivedByBroker: this.shippingTransactionForm.value.DateDocsReceivedByBroker?.toLocaleDateString() || null,
      BAI_SPS_IC_Date: this.shippingTransactionForm.value.BAI_SPS_IC_Date?.toLocaleDateString() || null,
      BPI_SPS_IC_Date: this.shippingTransactionForm.value.BPI_SPS_IC_Date?.toLocaleDateString() || null,
      OriginalDocsAvailavilityDate: this.shippingTransactionForm.value.OriginalDocsAvailavilityDate?.toLocaleDateString() || null,
      BankID: this.shippingTransactionForm.value.BankID || null,
      DateOfPickup: this.shippingTransactionForm.value.DateOfPickup?.toLocaleDateString() || null,
      PortOfDischarge: this.shippingTransactionForm.value.PortOfDischarge || null,
      Status: this.shippingTransactionForm.value.Status || 1,
      DateOfDischarge: this.shippingTransactionForm.value.DateOfDischarge?.toLocaleDateString() || null,
      LodgementDate:  this.shippingTransactionForm.value.LodgementDate?.toLocaleDateString() || null,
      LodgementBankID: this.shippingTransactionForm.value.LodgementBankID || null,
      GatepassRecieved: this.shippingTransactionForm.value.GatepassRecieved?.toLocaleDateString() || null,
      AcknowledgeByLogistics: this.shippingTransactionForm.value.AcknowledgeByLogistics?.toLocaleDateString() || null,
      StorageLastFreeDate: this.shippingTransactionForm.value.StorageLastFreeDate?.toLocaleDateString() || null,
      DemurrageDate: this.shippingTransactionForm.value.DemurrageDate?.toLocaleDateString() || null,
      DetentionDate: this.shippingTransactionForm.value.DetentionDate?.toLocaleDateString() || null,
      Remarks: this.shippingTransactionForm.value.Remarks || null,
      UserID: this.UserID,
    }

    // console.log(data)

    this.isSubmitting = true;

    this.importationService.saveShippingTransaction(data).pipe(take(1)).subscribe(
      response => {
        if( response === 1) {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Success', 
            detail: 'Successfully created', 
            life: 3000 
          });
          this.getShippingTransaction.emit();
          this.closeShippingDialog.emit()
          this.isSubmitting = false;
        } 
        else if ( response === 2) {
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Success', 
              detail: 'Item: ' + this.shippingTransactionForm.value.ContractPerformaID +  ' successfully updated', 
              life: 3000 
            });
            this.getShippingTransaction.emit();
            this.closeShippingDialog.emit()
            this.isSubmitting = false;
        }
        else if ( response === 0) {
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Warning', 
              detail: 'Item: ' + this.shippingTransactionForm.value.ShippingTransactionID +  ' already exist', 
              life: 3000 
            });
            this.isSubmitting = false;
        }
      },
      err => {
        console.log(err);
        this.messageService.add({
          severity: 'error', 
          summary: 'Danger', 
          detail: 'An unkown error occured' ,
          life: 3000 
        })
      }
    )

    
    
  }
  

}
