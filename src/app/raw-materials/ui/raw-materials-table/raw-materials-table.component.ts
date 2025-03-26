import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Message } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-raw-materials-table',
  templateUrl: './raw-materials-table.component.html',
  styleUrls: ['./raw-materials-table.component.css']
})
export class RawMaterialsTableComponent implements OnInit, OnDestroy {


  @Input() rawMaterials: any[] = [];
  @Input() insert: boolean = false;
  @Input() edit: boolean = false;
  @Input() stockView: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() rawMaterialError: Message[] = [];
  @Output() openDialog = new EventEmitter<void>();
  @Output() getData = new EventEmitter<void>();

  value: string | undefined;


  constructor(

  ) {}

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    
  }

  // ==== INPUT SEARCH DATA====
  onGlobalFilter(table: Table, event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    table.filterGlobal(inputValue, 'contains');
  }

}
