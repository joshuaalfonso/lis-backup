import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-shipping-transaction',
  templateUrl: './create-shipping-transaction.component.html',
  styleUrls: ['./create-shipping-transaction.component.css']
})
export class CreateShippingTransactionComponent {


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

  @Output() closeShippingDialog= new EventEmitter();

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
    'AdvanceDocumentsReceived': new FormControl(null),
    'BAI_SPS_IC': new FormControl(null),
    'FromBAIValidity': new FormControl(null),
    'ToBAIValidity': new FormControl(null),
    'BPI_SPS_IC': new FormControl(null),
    'FromBPIValidity': new FormControl(null),
    'ToBPIValidity': new FormControl(null),
    'MBL': new FormControl(null),
    'BL': new FormControl(null),
    'ShippingLineID': new FormControl(null),
    'Vessel': new FormControl(null),
    'HBL': new FormControl(null),
    'Forwarder': new FormControl(null),
    'ETD': new FormControl(null),
    'ETA': new FormControl(null),
    'ATA': new FormControl(null),
    'ContainerTypeID': new FormControl(0),
    'NoOfContainer': new FormControl(null),
    'NoOfTruck': new FormControl(null),
    'Quantity': new FormControl(null),
    'BrokerID': new FormControl(null),
    'DateDocsReceivedByBroker': new FormControl(null),
    'BAI_SPS_IC_Date': new FormControl(null),
    'BPI_SPS_IC_Date': new FormControl(null),
    'OriginalDocsAvailavilityDate': new FormControl(null),
    'BankID': new FormControl(null),
    'DateOfPickup': new FormControl(null),
    'PortOfDischarge': new FormControl(null),
    'Status': new FormControl(null),
    'DateOfDischarge': new FormControl(null),
    'LodgementDate': new FormControl(null),
    'LodgementBankID': new FormControl(null),
    'GatepassRecieved': new FormControl(null),
    'AcknowledgeByLogistics': new FormControl(null),
    'StorageLastFreeDate': new FormControl(null),
    'DemurrageDate': new FormControl(null),
    'DetentionDate': new FormControl(null),
    'Remarks': new FormControl(null),
    'UserID': new FormControl(null),
  })



  onSubmit() {

  }

}
