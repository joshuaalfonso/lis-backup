import { Component, Input } from '@angular/core';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-rawmats-parameters-table',
  templateUrl: './rawmats-parameters-table.component.html',
  styleUrls: ['./rawmats-parameters-table.component.css']
})
export class RawmatsParametersTableComponent {

  @Input() rawMaterials: any[] = [];
  @Input() isLoading = false;
  @Input() errorMessage: Message[] = [];
  @Input() parameters: any[] = [];

  standardDetails: any[] = [];

  visible: boolean = false;

  addStandard() {
    this.standardDetails.push({
      ParameterID: 0,
      StandardValue: 0
    })
  }

  removeStandard(i: number) {
    this.standardDetails.splice(i, 1)
  }

  showDialog() {
    this.visible = true;
    this.addStandard();
  }

  closeDialog() {
    this.standardDetails = [];
    this.visible = false;
  }

  getParamsName(standardParameters: any[]) {
    const namesString = standardParameters.map(item => `${item.Parameter}`).join(', ');
    return namesString || '-'
  }

}
