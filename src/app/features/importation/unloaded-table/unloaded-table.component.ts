import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ImportationService } from 'src/app/pages/importation/importation.service';

@Component({
  selector: 'app-unloaded-table',
  templateUrl: './unloaded-table.component.html',
  styleUrls: ['./unloaded-table.component.css']
})
export class UnloadedTableComponent implements OnInit, OnChanges, OnDestroy{


  unloadedBL: any[] = [];
  AllUnloadedBL: any[] = [];
  isLoading: boolean = false;
  subscriptions: Subscription = new Subscription;

  searchValue: string = '';

  @Input() selectedContractID: number = 0;

  constructor(
    private importationService: ImportationService,
    private route: ActivatedRoute,
  ) {}

  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchValue = params['search']?.toLowerCase() || '';
        
      this.unloadedBL = this.applyFilter(this.isLoading, this.AllUnloadedBL);
    });
  }

  ngOnChanges(): void {
    this.getUnloadBL2()
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getUnloadBL2() {
    this.isLoading = true;
    this.subscriptions.add(
      this.importationService.getUnloadedBL(this.selectedContractID).subscribe(
        response => {
          this.unloadedBL = response;
          this.AllUnloadedBL = response;
          this.isLoading = false;
          this.unloadedBL = this.applyFilter(this.isLoading, this.AllUnloadedBL);
          console.log(this.AllUnloadedBL)
        }
      )
    )
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

}
