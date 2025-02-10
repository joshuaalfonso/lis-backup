import { Component, EventEmitter, Input, Output } from '@angular/core';
import {jsPDF}  from 'jspdf';
import html2canvas from 'html2canvas';

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
  @Output() showDialog = new EventEmitter<void>();
  @Output() onSelect = new EventEmitter<void>();

  onToggleDialog() {
    this.showDialog.emit();
  }

  onEdit(row: any) {
    this.onSelect.emit(row);
  }


  generatePDF() {
    const elementsToPrint: any = document.getElementById('greet');

    html2canvas(elementsToPrint, { scale: 2 }).then((canvas) => {
      const pdf = new jsPDF();

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG' , 0, 0, 211, imgHeight);

      pdf.save('myFile.pdf');

    })
  }

}
