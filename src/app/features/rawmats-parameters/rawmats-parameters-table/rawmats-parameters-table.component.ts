import { AfterContentInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { RawMaterialStandardService } from 'src/app/pages/raw-material-standard/raw-material-standard.service';
import { RawMatsParametersService } from 'src/app/pages/rawmats-parameters/rawmats-parameters.service';

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
  @Input() userID: string = '';

  standardDetails: any[] = [];

  visible: boolean = false;

  rawMaterialStandardForm: FormGroup = new FormGroup({
    'StandardID': new FormControl(0),
    'RawMaterialID': new FormControl(null, Validators.required),
    'RawMaterial': new FormControl(null)
  })

  constructor(
    private rawMaterialStandardService: RawMaterialStandardService
  ) {}

  addStandard() {
    this.standardDetails.push({
      ParameterID: 0,
      Value: 0,
      Boolean: 0,
      UserID: this.userID
    })
  }

  removeStandard(i: number) {
    this.standardDetails.splice(i, 1)
  }

  showDialog() {
    this.visible = true;
    this.addStandard();
    // console.log(data)
    // this.rawMaterialStandardForm.reset({
    //   StandardID: 0,
    //   RawMaterialID: data.RawMaterialID,
    //   RawMaterial: data.RawMaterial
    // })
  }

  closeDialog() {
    this.standardDetails = [];
    this.rawMaterialStandardForm.reset();
    this.visible = false;
  }

  getParamsName(standardParameters: any[]) {
    const namesString = standardParameters.map(item => `${item.Parameter}`).join(', ');
    return namesString || '-'
  }


  onSubmit() {
    // console.log(this.rawMaterialStandardForm.value);

    const data = {
      ...this.rawMaterialStandardForm.value,
      Parameters: this.standardDetails
    }

    // console.log(data)

    this.rawMaterialStandardService.setParams(data).subscribe(
      response => {
        console.log(response)
      },
      error => {
        console.log(error);
      }
    )

  }

}
