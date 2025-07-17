import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ImportationService } from 'src/app/pages/importation/importation.service';

@Component({
  selector: 'app-received-table',
  templateUrl: './received-table.component.html',
  styleUrls: ['./received-table.component.css']
})
export class ReceivedTableComponent implements OnInit, OnDestroy, OnChanges{


  received: any[] = [];
  Allreceived: any[] = [];
  isLoading: boolean = false;

  @Input() selectedContractID: number = 0;
  @Input() selectedPackaging: number = 0;

  searchValue: string = '';


  subscriptions: Subscription = new Subscription;

  constructor(
    private importationService: ImportationService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // this.getReceived();

    this.route.queryParams.subscribe(params => {
      this.searchValue = params['search']?.toLowerCase() || '';
      console.log('Search:', this.searchValue);
      // this.filterData(searchValue)
        
      this.received = this.applyFilter(this.isLoading, this.Allreceived);

    });

  }

  ngOnChanges(): void {
    console.log('changes')
    this.getReceived();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  applyFilter(isLoading: boolean, data: any[]): any[] {
    if (isLoading) return [];

    const search = this.searchValue?.toLowerCase().trim();

    if (!search) {
        return [...data];
    }

    return data.filter(item =>
      Object.values(item).some(val =>
        val !== null &&
        val !== undefined &&
        val.toString().toLowerCase().includes(search)
      )
  );
}


  getReceived() {
    this.isLoading = true;
    this.subscriptions.add(
      this.importationService.getReceived(this.selectedContractID).subscribe(
        response => {
          // console.log(response)
          // this.received = response;
          this.Allreceived = response;
          this.isLoading = false;
          this.received = this.applyFilter(this.isLoading, this.Allreceived);
        },
        err => {
          console.log(err)
        }
      )
    )
  }

}
