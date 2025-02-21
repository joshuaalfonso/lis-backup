import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
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
  @Output() showDialog = new EventEmitter<void>();
  @Output() onSelect = new EventEmitter<void>();
  @Output() getData = new EventEmitter<void>();

  value: string | undefined;
  items: any[] | undefined;


  constructor(

  ) {}

  ngOnInit(): void {
    this.items = [
      {
          label: 'Options',
          items: [
              {
                  label: 'Refresh',
                  icon: 'pi pi-refresh',
                  command: () => {
                      this.getData.emit();
                  }
              },
              {
                  label: 'Export',
                  icon: 'pi pi-upload'
              }
          ]
      }
    ];
  }

  ngOnDestroy(): void {
    
  }

  onShowDialog() {
    this.showDialog.emit();
  }

  onSelectRow(data: any) {
    this.onSelect.emit(data);
  }

  // ==== INPUT SEARCH DATA====
  onGlobalFilter(table: Table, event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    table.filterGlobal(inputValue, 'contains');
  }

}
