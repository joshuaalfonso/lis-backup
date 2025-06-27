import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-pullout-dialog',
  templateUrl: './pullout-dialog.component.html',
  styleUrls: ['./pullout-dialog.component.css']
})
export class PulloutDialogComponent implements OnChanges{

  @Input() pullOutVisible: boolean = false;
  @Input() PullOutDetail: any[] = [];
  @Input() trucking: any[] = [];
  @Input() selectedPullOut: any = null;

  isLoading: boolean = false;

  @Output() onClosePullOut = new EventEmitter();

  @ViewChild('PullOutDialog') dialog!: Dialog;

  pulloutForm = new FormGroup({
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

  ngOnChanges(): void {
    if (this.selectedPullOut) {
      
      this.pulloutForm.patchValue({
        MBL: this.selectedPullOut.MBL,
        HBL: this.selectedPullOut.MBL,
        Supplier: this.selectedPullOut.Supplier,
        Broker: this.selectedPullOut.Broker,
      })

      // this.PullOutDetail = this.selectedPullOut.PullOutDetail

    } else {
    }
  }

//   onSelectPullOut(data: any, dialog: Dialog) {
//     // console.log(data);
//     dialog.maximize();
//     this.showPullOutDialog();
//     this.PullOutDetail = [];

//     this.pulloutForm.patchValue({
//         MBL: data.MBL,
//         HBL: data.HBL,
//         Supplier: data.Supplier,
//         Broker: data.Broker,
//         DateOfDischarge: data.DateOfDischarge,
//         StorageLastFreeDate: data.StorageLastFreeDate,
//         DemurrageDate: data.DemurrageDate,
//         DetentionDate: data.DetentionDate
//     })

//     // console.log(this.pulloutForm.value)


//     this.isLoading3 = true;

//     this.ContractPerformaService.getPullOutDetail(data.MBL).subscribe(
//         response => {
//             for (let i = 0; i < response.length; i++) {
//                 let TruckingValue = this.findObjectByID(response[i].TruckingID, 'TruckingID', this.trucking);
//                 let data = {
//                     PullOutID: response[i].PullOutID,
//                     PullOutDate: response[i].PullOutDate == null ? null : new Date(response[i].PullOutDate.date),
//                     ContainerNumber: response[i].ContainerNumber,
//                     DateIn: response[i].DateIn == null ? null : new Date(response[i].DateIn.date),
//                     DateOut: response[i].DateOut == null ? null : new Date(response[i].DateOut.date),
//                     ReturnDate: response[i].ReturnDate == null ? null : new Date(response[i].ReturnDate.date),
//                     TruckingID: TruckingValue,
//                     DateOfDischarge: response[i].DateOfDischarge == null ? null : new Date(response[i].DateOfDischarge.date),
//                     Storage: response[i].Storage == null ? null : new Date(response[i].Storage.date),
//                     Demurrage: response[i].Demurrage == null ? null : new Date(response[i].Demurrage.date),
//                     Detention: response[i].Detention == null ? null : new Date(response[i].Detention.date),
//                     Remarks: response[i].Remarks,
//                     deleted: response[i].deleted
//                 }
//                 this.PullOutDetail.push(data)
//             }
//             this.isLoading3 = false;
//         }
//     )

// }

  maximize() {
    this.dialog.maximize();
  }

  onSubmit() {

  }

  removePullOutRow(index: number) {

  }

  addPullOutRow() {

  }

}
