import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PulloutDialogComponent } from '../pullout-dialog/pullout-dialog.component';
import { Subscription } from 'rxjs';
import { TruckingService } from 'src/app/pages/trucking/trucking.service';

@Component({
  selector: 'app-pullout-table',
  templateUrl: './pullout-table.component.html',
  styleUrls: ['./pullout-table.component.css']
})
export class PulloutTableComponent implements OnInit, OnDestroy{

  @Input() shippingTransaction: any[] = [];
  @Input() shippingTransactionIsLoading: boolean = false;

  @ViewChild(PulloutDialogComponent) pullOutDialogComp!: PulloutDialogComponent;

  trucking: any[] = [];

  PullOutDetail: any[] = [];

  pullOutVisible: boolean = false;

  selectedPullOut: any;

  subscriptions: Subscription = new Subscription;

  ngOnInit(): void {
    this.getTrucking();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  constructor(
    private truckingService: TruckingService
  ) {}

  getTrucking() {
    this.subscriptions.add(
      this.truckingService.getTruckingData().subscribe(
        response => {
          this.trucking = response
        },
        err => {
          console.error(err)
        }
      )
    )
  }

  onEditPullOut(row?: any) {
    this.pullOutVisible = true;
    this.PullOutDetail = [];
    this.pullOutDialogComp.maximize();
    
    this.selectedPullOut = row;
    // this.PullOutDetail = [...row.PullOutDetail]
    // console.log(this.selectedPullOut)



  }

  onClosePullOut() {
    this.pullOutVisible = false;
    this.selectedPullOut = null;
  }

}
