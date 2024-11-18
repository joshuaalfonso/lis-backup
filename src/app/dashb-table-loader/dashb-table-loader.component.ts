import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashb-table-loader',
  templateUrl: './dashb-table-loader.component.html',
  styleUrls: ['./dashb-table-loader.component.css']
})
export class DashbTableLoaderComponent implements OnInit{

  loadingLength: any[] = [];
  @Input() length: number = 7;

  ngOnInit(): void {
    this.loadingLength = Array.from({ length: this.length }).map((_, i) => `Item #${i}`);
  }

}
