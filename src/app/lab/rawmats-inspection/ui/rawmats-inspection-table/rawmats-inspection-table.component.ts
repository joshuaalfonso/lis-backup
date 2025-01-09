import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-rawmats-inspection-table',
  templateUrl: './rawmats-inspection-table.component.html',
  styleUrls: ['./rawmats-inspection-table.component.css']
})
export class RawmatsInspectionTableComponent {


  @Input() rawMatsInspection: any[] = [];
  @Input() isLoading: boolean = false;
  @Output() showDialog = new EventEmitter<void>();

  onToggleDialog() {
    this.showDialog.emit();
  }

}
