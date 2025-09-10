import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { RawMaterialsService } from '../../raw-materials.service';
import { RawMaterial, Uom } from '../../raw-materials.model';
import { RawMaterialCategoryList } from 'src/app/pages/raw-material-category/raw-material-category.model';
import { RawMaterialPackagingList } from 'src/app/pages/raw-material-packaging/raw-material-packaging.model';

@Component({
  selector: 'app-raw-materials-modal',
  templateUrl: 'raw-materials-modal.component.html',
  styleUrls: ['raw-materials-modal.component.css']
})
export class RawMaterialsModalComponent implements OnChanges{

  @Input() visible: boolean = false;
  @Input() selectedRawMaterial: any;
  @Input() userID!: string;
  @Input() rawMaterialCategory: RawMaterialCategoryList[] =[];
  @Input() UnitOfMeasure: RawMaterialPackagingList[] =[];
  @Output() getData = new EventEmitter<void>();
  @Output() closeDialog = new EventEmitter<void>();

  submitLoading: boolean = false;

  rawMatsForm: FormGroup = new FormGroup({
    'RawMaterialID': new FormControl(0),
    'RawMaterial': new FormControl(null, Validators.required),
    'Quantity': new FormControl(0),
    'Weight': new FormControl(0),
    'MinimumQuantity': new FormControl(null, Validators.required),
    'MinimumWeight': new FormControl(null, Validators.required),
    'Category': new FormControl(null, Validators.required),
    'CategoryID': new FormControl(null, Validators.required),
    'PackagingID': new FormControl(null, Validators.required),
    'UserID': new FormControl(0),
  });

  constructor(
    private MessageService: MessageService,
    private RawMaterialsService: RawMaterialsService
  ) {}

  ngOnChanges(): void {
    
    if (this.selectedRawMaterial) {
      this.rawMatsForm.setValue({
        ...this.selectedRawMaterial,
        UserID: this.userID
      })
      console.log(this.selectedRawMaterial)
    } else {
      this.rawMatsForm.reset({
        RawMaterialID: 0,
        RawMaterial: null,
        Quantity: 0,
        Weight: 0,
        MinimumQuantity: 0,
        MinimumWeight: 0,
        Category: null,
        UserID: this.userID
      })
    }
    
    
  }

  onGetData() {
    this.getData.emit();
  }


  // ==== SUBMIT FORM DATA ====
  onSubmit() {
    if (!this.rawMatsForm.valid) {
        console.log('Please fill all the blanks')
    }

    this.submitLoading = true;

    const data: RawMaterial = {...this.rawMatsForm.value}

    let authObs: Observable<any>;
    authObs = this.RawMaterialsService.saveData
    (
      data
    );

    authObs.subscribe(response =>{

        this.submitLoading = false;

        if( response === 1) {
            this.MessageService.add({ 
                severity: 'success', 
                summary: 'Success', 
                detail:'Successfully recorded!', 
                life: 3000 
            });
            this.onGetData();
            this.closeDialog.emit();
        } 
        else if ( response === 2) {

            this.MessageService.add({ 
                severity: 'success', 
                summary: 'Success', 
                detail: 'Successfully updated!', 
                life: 3000 
            });
            this.onGetData();
            this.closeDialog.emit();
        }
        else if ( response === 0) {

            this.MessageService.add({ 
                severity: 'error', 
                summary: 'Danger', 
                detail: 'Item: ' + this.rawMatsForm.value.RawMaterial +  ' already exist', 
                life: 3000 
            });

        }
        
    }, errorMessage => {
      this.MessageService.add({ 
        severity: 'error', 
        summary: 'Danger', 
        detail: errorMessage, 
        life: 3000 
      });

      this.submitLoading = false;
    })

  }

}


