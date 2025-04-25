import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UnloadingTransactionService } from '../unloading-transaction/unloading-transaction.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-unloading-detail',
  templateUrl: './unloading-detail.component.html',
  styleUrls: ['./unloading-detail.component.css']
})
export class UnloadingDetailComponent implements OnInit {

  id!: string | null;
  unloadingItem: any;

  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private unloadingService: UnloadingTransactionService
  ) {}

  ngOnInit(): void {

    this.id = this.route.snapshot.paramMap.get('id');

    this.unloadingService.
    getUnloadingItem(Number(this.id)).pipe(take(1)).subscribe(
      response => {
        console.log(response);
        this.unloadingItem = response[0];
        this.isLoading = false;
      },

      error => {
        console.log(error);
        this.isLoading = false;
      }
    )

  }

  goBack(): void {
    this.location.back();
  }

}
