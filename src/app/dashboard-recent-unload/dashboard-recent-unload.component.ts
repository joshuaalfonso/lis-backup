import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-recent-unload',
  templateUrl: './dashboard-recent-unload.component.html',
  styleUrls: ['./dashboard-recent-unload.component.css']
})
export class DashboardRecentUnloadComponent implements OnInit, OnDestroy {

  @Input() recentUnload: any[] = [];
  @Input() unloadLoading: boolean = false;

  loadingLength: any[] = [];

  ngOnInit(): void {
    this.loadingLength = Array.from({ length: 7 }).map((_, i) => `Item #${i}`);
  }

  ngOnDestroy(): void {
    
  }

}
