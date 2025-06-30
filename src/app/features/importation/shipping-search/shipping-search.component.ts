import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-shipping-search',
  templateUrl: './shipping-search.component.html',
  styleUrls: ['./shipping-search.component.css']
})
export class ShippingSearchComponent implements OnInit{

  searchTerm: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const searchValue = params['search'] || '';
      // console.log('Searchzxc:', searchValue);
      // this.filterData(searchValue)
      this.searchTerm = searchValue;
    });
  }


  onSearchChange(term: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: term },
      queryParamsHandling: 'merge'
  });

    // this.filterData(term);
  } 

}
