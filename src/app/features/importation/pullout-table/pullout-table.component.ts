import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { PulloutDialogComponent } from '../pullout-dialog/pullout-dialog.component';
import { Subscription } from 'rxjs';
import { TruckingService } from 'src/app/pages/trucking/trucking.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pullout-table',
  templateUrl: './pullout-table.component.html',
  styleUrls: ['./pullout-table.component.css']
})
export class PulloutTableComponent implements OnInit, OnDestroy{

  @Input() shippingTransaction: any[] = [];
  @Input() shippingTransactionIsLoading: boolean = false;

  @Input() userID: any;

  @Input() edit: boolean = false;

  @Output() getShippingTransaction = new EventEmitter;

  @ViewChild(PulloutDialogComponent) pullOutDialogComp!: PulloutDialogComponent;

  trucking: any[] = [];
  @Input() supplier: any[] = [];
  @Input() broker: any[] = [];

  PullOutDetail: any[] = [];

  pullOutVisible: boolean = false;

  selectedPullOut: any;

  subscriptions: Subscription = new Subscription;

  searchValue: string = '';

  constructor(
    private truckingService: TruckingService,
    private route: ActivatedRoute
  ) {}
  

  ngOnInit(): void {
    this.getTrucking();

   
      this.route.queryParams.subscribe(params => {
        const searchValue = params['search'] || '';
        // console.log('Searchzxc:', searchValue);
        // this.filterData(searchValue)
        this.searchValue = searchValue;
      });
  
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


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

  handleGetShipping() {
    this.getShippingTransaction.emit()
  }

}
