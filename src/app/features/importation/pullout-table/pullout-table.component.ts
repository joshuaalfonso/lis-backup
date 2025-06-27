import { Component, Input, ViewChild } from '@angular/core';
import { PulloutDialogComponent } from '../pullout-dialog/pullout-dialog.component';

@Component({
  selector: 'app-pullout-table',
  templateUrl: './pullout-table.component.html',
  styleUrls: ['./pullout-table.component.css']
})
export class PulloutTableComponent {

  @Input() shippingTransaction: any[] = [];
  @Input() shippingTransactionIsLoading: boolean = false;

  @ViewChild(PulloutDialogComponent) pullOutDialogComp!: PulloutDialogComponent;

  trucking: any[] = [];

  PullOutDetail: any[] = [];

  pullOutVisible: boolean = false;

  selectedPullOut: any;

  onEditPullOut(row?: any) {
    this.pullOutVisible = true;
    this.PullOutDetail = [];
    this.pullOutDialogComp.maximize();
    
    this.selectedPullOut = row;
    this.PullOutDetail = [...row.PullOutDetail]
    console.log(this.selectedPullOut)
  }

  onClosePullOut() {
    this.pullOutVisible = false;
    this.selectedPullOut = null;
  }

}
