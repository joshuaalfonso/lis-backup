import { Component, OnDestroy, OnInit } from '@angular/core';
import { BinloadService } from '../../binload.service';
import { Subscription } from 'rxjs';
import { Table } from 'primeng/table';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-binload-verified-table',
  templateUrl: './binload-verified-table.component.html',
  styleUrls: ['./binload-verified-table.component.css']
})


export class BinloadVerifiedTableComponent implements OnInit, OnDestroy{

  binloadVerified: any[] = [];
  binloadVerifiedError!: any[];
  binloadVerifiedIsLoading: boolean = false;

  subscription: Subscription = new Subscription;

  constructor(
    private binloadService: BinloadService
  ) {}


  ngOnInit(): void {

    this.getVerifiedBinload();
    
  }

  ngOnDestroy(): void {
    
  }

  getVerifiedBinload() {
    this.binloadVerifiedIsLoading = true;

    this.subscription.add(
      this.binloadService.getBinloadVerified().subscribe(
        response => {
          this.binloadVerified = response;
          this.binloadVerifiedIsLoading = false;
        }, 
        error => {
          console.log('Error :' + error);
          this.binloadVerifiedError = [{ severity: 'error', detail: error.message || 'There was an error fetching data' }];
          this.binloadVerifiedIsLoading= false
        }
      )
    )
  }

   // ==== INPUT SEARCH DATA====
   onGlobalFilter(table: Table, event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    table.filterGlobal(inputValue, 'contains');
  }

}

// interface Message {
//   severity: string,
//   detail: string
// }
