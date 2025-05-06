import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Message } from 'primeng/api';
import { RawMatsInspectionService } from '../../rawmats-inspection.service';

@Component({
  selector: 'app-rawmats-inspection-table',
  templateUrl: './rawmats-inspection-table.component.html',
  styleUrls: ['./rawmats-inspection-table.component.css']
})
export class RawmatsInspectionTableComponent {

  columns = ["ID", "Name", "Age"];
  data = [
    [1, "John Doe", 30],
    [2, "Jane Smith", 25],
    [3, "Jim Brown", 35],
    [4, "Jake White", 28]
  ];


  @Input() rawMatsInspection: any[] = [];
  @Input() isLoading: boolean = false;
  @Input() rawMatsInspectionError: Message[] = [];
  @Output() showDialog = new EventEmitter<void>();
  @Output() onSelect = new EventEmitter<void>();

  constructor(
    private RawMatsInspectionService: RawMatsInspectionService
  ) {}

  onToggleDialog() {
    this.showDialog.emit();
  }

  onEdit(row: any) {
    this.onSelect.emit(row);
  }

  getPdf(id: number) {
    window.open('http://10.10.2.120/project/lab/InspectionReport.php?id=' + id, '_blank');
  }
 
}
