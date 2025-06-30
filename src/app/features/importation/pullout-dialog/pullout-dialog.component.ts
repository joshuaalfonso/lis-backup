import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { take } from 'rxjs';
import { ImportationService } from 'src/app/pages/importation/importation.service';

@Component({
  selector: 'app-pullout-dialog',
  templateUrl: './pullout-dialog.component.html',
  styleUrls: ['./pullout-dialog.component.css']
})
export class PulloutDialogComponent implements OnChanges{

  @Input() pullOutVisible: boolean = false;
  @Input() trucking: any[] = [];
  @Input() selectedPullOut: any = null;
  @Input() userID: any;

  PullOutDetail: any[] = [];

  isLoading: boolean = false;

  @Output() onClosePullOut = new EventEmitter();
  @Output() getShippingTransaction = new EventEmitter;

  @ViewChild('PullOutDialog') dialog!: Dialog;

  isSubmitting: boolean = false;

  pulloutForm:FormGroup = new FormGroup({
    'MBL': new FormControl(null),
    'HBL': new FormControl(null),
    'Supplier': new FormControl(null),
    'Broker': new FormControl(null),
    'DateOfDischarge': new FormControl(null),
    'StorageLastFreeDate': new FormControl(null),
    'DemurrageDate': new FormControl(null),
    'DetentionDate': new FormControl(null),
    'UserID': new FormControl(0),
  })

  constructor(
    private importationService: ImportationService,
    private messageService: MessageService
  ) {}


  ngOnChanges(): void {
    if (this.selectedPullOut) {
      this.pulloutForm.patchValue({
        MBL: this.selectedPullOut.MBL,
        HBL: this.selectedPullOut.MBL,
        Supplier: this.selectedPullOut.Supplier,
        Broker: this.selectedPullOut.Broker,
        DateOfDischarge: this.selectedPullOut.DateOfDischarge,
        StorageLastFreeDate: this.selectedPullOut.StorageLastFreeDate,
        DemurrageDate: this.selectedPullOut.DemurrageDate,
        DetentionDate: this.selectedPullOut.DetentionDate
      }) 

      this.isLoading = true;
      this.importationService.getPullOutDetail(this.selectedPullOut.MBL).pipe(take(1)).subscribe
      (response => {
        this.isLoading = false;
        
        this.PullOutDetail = response.map((item: any) => ({
          PullOutID: item.PullOutID,
          PullOutDate: item.PullOutDate == null ? null : new Date(item.PullOutDate.date),
          ContainerNumber: item.ContainerNumber,
          DateIn: item.DateIn == null ? null : new Date(item.DateIn.date),
          DateOut: item.DateOut == null ? null : new Date(item.DateOut.date),
          ReturnDate: item.ReturnDate == null ? null : new Date(item.ReturnDate.date),
          TruckingID: item.TruckingID,
          DateOfDischarge: item.DateOfDischarge == null ? null : new Date(item.DateOfDischarge.date),
          Storage: item.Storage == null ? null : new Date(item.Storage.date),
          Demurrage: item.Demurrage == null ? null : new Date(item.Demurrage.date),
          Detention: item.Detention == null ? null : new Date(item.Detention.date),
          Remarks: item.Remarks,
          deleted: item.deleted
        }))

      },
        error => {
          console.log(error)
          alert('An unknwon error occured')
        }
      )

    } else {
      this.PullOutDetail = [];
    }
  }

  maximize() {
    this.dialog.maximize();
  }

  addPullOutRow() {
    let data = {
      PullOutID: 0,
      PullOutDate: null,
      ContainerNumber: null,
      DateIn: null,
      DateOut: null,
      ReturnDate: null,
      TruckingID: null,
      DateOfDischarge: this.pulloutForm.value.DateOfDischarge == null ? null : new Date(this.pulloutForm.value.DateOfDischarge.date),
      Storage: this.pulloutForm.value.StorageLastFreeDate == null ? null : new Date(this.pulloutForm.value.StorageLastFreeDate.date),
      Demurrage:  this.pulloutForm.value.DemurrageDate == null ? null : new Date(this.pulloutForm.value.DemurrageDate.date),
      Detention:  this.pulloutForm.value.DetentionDate == null ? null : new Date(this.pulloutForm.value.DetentionDate.date),
      Remarks: null,
      deleted: 0
    }
    this.PullOutDetail.push(data)
  }

  removePullOutRow(index: number) {
      this.PullOutDetail.splice(index, 1);
  }

  onSubmit() {

    let TransformedArray: {
        PullOutID: number,
        PullOutDate: string | null,
        ContainerNumber: number,
        DateIn: string | null,
        DateOut: string | null,
        ReturnDate: string | null,
        TruckingID: any
        Storage: string | null,
        DateOfDischarge: string | null,
        Demurrage: string | null,
        Detention: string | null,
        Remarks: String | null,
        deleted: number
    }[] = [];
    
    this.PullOutDetail.forEach(item => {
        TransformedArray.push({
            PullOutID: item.PullOutID,
            PullOutDate: item.PullOutDate === null ? null : new Date(item.PullOutDate).toLocaleDateString(),
            ContainerNumber: item.ContainerNumber,
            DateIn: item.DateIn === null ? null : new Date(item.DateIn).toLocaleDateString(),
            DateOut: item.DateOut === null ? null : new Date(item.DateOut).toLocaleDateString(),
            ReturnDate: item.ReturnDate === null ? null : new Date(item.ReturnDate).toLocaleDateString(),
            TruckingID: item.TruckingID,
            DateOfDischarge: item.DateOfDischarge === null ? null : new Date(item.DateOfDischarge).toLocaleDateString(),
            Storage: item.Storage === null ? null : new Date(item.Storage).toLocaleDateString(),
            Demurrage: item.Demurrage === null ? null : new Date(item.Demurrage).toLocaleDateString(),
            Detention: item.Detention === null ? null : new Date(item.Detention).toLocaleDateString(),
            Remarks: item.Remarks,
            deleted: item.deleted
        });
    });
    // console.log(TransformedArray);

    const data = {
      MBL: this.pulloutForm.value.MBL,
      HBL: this.pulloutForm.value.HBL,
      UserID: this.userID,
      PullOutDetail: TransformedArray
    }

    console.log(data);

    this.isSubmitting = true;
    
   
    this.importationService.savePullOut(data).pipe(take(1)).subscribe(response => {

      this.isSubmitting = false;

      if( response === 1) {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: ' successfully updated', 
          life: 3000 
        });
          // this.onFilterShippingTransaction();
          this.onClosePullOut.emit();
          this.getShippingTransaction.emit()
      } 
      else if ( response === 2) {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: ' successfully updated', 
          life: 3000 
        });
          // this.onFilterShippingTransaction();
          this.onClosePullOut.emit();
          this.getShippingTransaction.emit();
      }
        
    }, 

    errorMessage => {
      this.isSubmitting = false;
      this.messageService.add({ 
        severity: 'error', summary: 'Danger', 
        detail: errorMessage, 
        life: 3000 
      });
    })
    
  }



}
