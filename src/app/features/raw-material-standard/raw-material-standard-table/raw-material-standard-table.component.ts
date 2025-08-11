import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { RawMaterialStandardService } from 'src/app/pages/raw-material-standard/raw-material-standard.service';

@Component({
  selector: 'app-raw-material-standard-table',
  templateUrl: './raw-material-standard-table.component.html',
  styleUrls: ['./raw-material-standard-table.component.css']
})
export class RawMaterialStandardTableComponent {

  @Input() rawMaterialStandard: any[] = [];
  @Input() isLoading = false;
  @Input() errorMessage: Message[] = [];

  @Output() showDialog = new EventEmitter();


  getParamsName(standardParameters: any[]) {
    const namesString = standardParameters.map(item => `${item.Parameter}`).join(', ');
    return namesString || '-'
  }


}
