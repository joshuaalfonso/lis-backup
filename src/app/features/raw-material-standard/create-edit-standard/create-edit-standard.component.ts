import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { RawMaterialStandardService } from 'src/app/pages/raw-material-standard/raw-material-standard.service';

@Component({
  selector: 'app-create-edit-standard',
  templateUrl: './create-edit-standard.component.html',
  styleUrls: ['./create-edit-standard.component.css']
})
export class CreateEditStandardComponent implements OnChanges{

  @Input() visible: boolean = false;
  @Input() rawMaterials: any[] = [];
  @Input() parameters: any[] = [];
  @Input() userID: string = '';
  @Input() selectedRow: any;

  @Output() closeDialog = new EventEmitter();
  @Output() getRawMaterialStandard = new EventEmitter();

  standardDetails: any[] = [];

  isSubmitted: boolean = false;

  positiveNegative = [
    {
      label: 'Negative',
      value: 0
    },
    {
      label: 'Positive',
      value: 1
    },
  ]
  
  rawMaterialStandardForm: FormGroup = new FormGroup({
    'RawMaterialStandardID': new FormControl(0),
    'RawMaterialID': new FormControl(null, Validators.required),
  })

  constructor(
    private rawMaterialStandardService: RawMaterialStandardService,
    private messageService: MessageService
  ) {}
  
  ngOnChanges(): void {
    
    this.standardDetails = [];
    this.rawMaterialStandardForm.reset({
      RawMaterialStandardID: 0
    })
    
    if (this.selectedRow) {

      this.rawMaterialStandardForm.setValue({
        RawMaterialStandardID: this.selectedRow.RawMaterialStandardID,
        RawMaterialID: this.selectedRow.RawMaterialID
      });

      this.standardDetails = [...this.selectedRow.StandardDetail];

    } else {
      this.addStandard();
    }

  }
  

  handleGetRawMaterialStandard() {
    this.getRawMaterialStandard.emit();
  }

  onSubmit() {

    this.isSubmitted = true;
   
    if (!this.rawMaterialStandardForm.valid || !this.isFormValid()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Each row must have a Parameter and Value.',
      });
      return
    }

    const data = {
      ...this.rawMaterialStandardForm.value,
      RawMaterialStandardDetails: this.standardDetails
    }

    // console.log(data)

    this.rawMaterialStandardService.setParams(data).pipe(take(1)).subscribe(
      response => {

        if (response === 1) {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Success', 
            detail: 'Successfully created', 
            life: 3000 
          });
          this.handleGetRawMaterialStandard();
          this.handleCloseDialog();
        }

        else if (response === 2) {

          this.messageService.add({ 
            severity: 'success', 
            summary: 'Success', 
            detail: 'Successfully updated', 
            life: 3000 
          });
          this.handleGetRawMaterialStandard();
          this.handleCloseDialog();

        } else if (response === 0) {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Warning', 
            detail: `Already exist`, 
            life: 3000 
          });
        }

      },
      error => {
        console.log(error)
      }
    )

  }

  handleCloseDialog() {
    this.standardDetails = [];
    this.rawMaterialStandardForm.reset();
    this.closeDialog.emit();
    this.isSubmitted = false;

  }

  addStandard() {
    this.standardDetails.push({
      RawMaterialStandardDetailID: 0,
      ParameterID: 0,
      OperatorID: 0,
      Value: null,
      Boolean: 0,
      UserID: this.userID
    })
  }

  removeStandard(i: number) {
    this.standardDetails.splice(i, 1)
  }

  onSelectParameter(parameterId: number, index: number) {

    const parameter = this.parameters.find(item => item.ParameterID === parameterId);

    this.standardDetails[index] = {
      ...this.standardDetails[index],
      OperatorID: parameter ? parameter.OperatorID : null,
      OperatorName: parameter ? parameter.OperatorName : null
    }

  }

  isFormValid(): boolean {
    let valid = true;
  
    for (const row of this.standardDetails) {
      if ((!row.ParameterID || row.Value === null || row.Value === null || row.Value === '') && row.OperatorID !== 4) {
        valid = false;
        break;
      }
    }
  
    return valid;
  }

  hasRowError(row: any): boolean {
    return !row.ParameterID || row.Value === null || row.Value === null || row.Value === '';
  }

  parameterError(row: any): boolean {
    return !row.ParameterID && this.isSubmitted;
  }

  parameterValueError(row: any): boolean {
    return (row.Value === null || row.Value === undefined || row.Value === '') && this.isSubmitted
  }

}
