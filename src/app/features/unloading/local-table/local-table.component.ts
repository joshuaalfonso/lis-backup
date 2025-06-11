import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Message } from 'primeng/api';
import { Subscription } from 'rxjs';
import { UnloadingTransactionService } from 'src/app/unloading-transaction/unloading-transaction.service';

@Component({
  selector: 'app-local-table',
  templateUrl: './local-table.component.html',
  styleUrls: ['./local-table.component.css']
})
export class LocalTableComponent implements OnInit, OnDestroy{


  localUnload: any[] = [];
  isLoading: boolean = false;
  unloadingError: Message[] = [];

  @Input() userID!: string;
  @Input() tabValue: number = 1;
  @Input() view: boolean = false;
  @Input() insert: boolean = false;
  @Input() edit: boolean = false;
  @Input() generateReport: boolean = false;
  @Input() verifiedView: boolean = false;
  @Input() delete: boolean = false;

  subscriptions: Subscription = new Subscription;

  constructor(
    private localUnloadingService: UnloadingTransactionService
  ){}

  ngOnInit(): void {
    this.getLocalUnloading();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


  getLocalUnloading() {
    this.isLoading = true;
    this.subscriptions.add(
      this.localUnloadingService.filterUnloadingTransaction({id: this.tabValue, checkerID: this.userID}).subscribe(
        response => {
          this.isLoading = false;
          this.localUnload = response;
        }, error => {
            console.log(error);
            this.isLoading = false;
            this.unloadingError = [{ severity: 'error', detail: 'There was an error  fetching data' }]
        }
      )
    )
  }

}
