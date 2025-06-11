import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TransferService } from '../../../raw-material-transfer/transfer.service';

@Component({
  selector: 'app-dashboard-recent-transfer',
  templateUrl: './dashboard-recent-transfer.component.html',
  styleUrls: ['./dashboard-recent-transfer.component.css']
})
export class DashboardRecentTransferComponent implements OnInit, OnDestroy{

  recentTransfer: any[] = [];
  transferLoading : boolean = false;

  subscriptions: Subscription = new Subscription;

  constructor(
    private RawMaterialTransferService: TransferService
  ) {}

  ngOnInit(): void {
    this.getRecentTransfer();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


  getRecentTransfer() {

    this.transferLoading = true;

    this.subscriptions.add(
      this.RawMaterialTransferService.getRecentTransfer().subscribe(
        (response) => {
          this.recentTransfer = response.map((item: any) => {
            return {
              ...item,
              events: [
                  {
                      status: 'Time Out',
                      date: item.FeedmixDeparture
                  },
                  {
                      status: 'Source Arrival',
                      date: item.SourceArrival
                  },
                  {
                      status: 'Source Departure',
                      date: item.SourceDeparture
                  },
                  {
                      status: 'Time In',
                      date: item.FeedmixArrival
                  }
              ]
            };
          });

        },
        (error) => {
          console.error('There was an error fetching recent transfer' + error)
        },
        () => {
          this.transferLoading = false;
        }
      )
    )
  }

}
