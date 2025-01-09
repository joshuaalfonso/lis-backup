import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { RawMaterialsService } from '../../raw-materials.service';

@Component({
  selector: 'app-raw-materials-modal',
  templateUrl: 'raw-materials-modal.component.html',
  styleUrls: ['raw-materials-modal.component.css']
})
export class RawMaterialsModalComponent implements OnInit, OnDestroy {

  @Input() visible: boolean = false;
  @Input() modalHeader: string = '';
  @Input() rawMatsForm!: FormGroup;
  @Input() submitLoading: boolean = false;
  @Output() submit = new EventEmitter<void>();
  @Output() toggleDialog = new EventEmitter<void>();
  @Output() getData = new EventEmitter<void>();

  userID!: string;

  constructor(
    private MessageService: MessageService,
    private RawMaterialsService: RawMaterialsService
  ) {}


  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    
  }

  onToggleDialog() {
    this.toggleDialog.emit();
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


    let authObs: Observable<any>;
    authObs = this.RawMaterialsService.saveData
    (
      this.rawMatsForm.value.RawMaterialID, 
      this.rawMatsForm.value.RawMaterial, 
      this.rawMatsForm.value.Category, 
      this.rawMatsForm.value.Packaging, 
      this.rawMatsForm.value.Quantity, 
      this.rawMatsForm.value.Weight, 
      this.rawMatsForm.value.MinimumQuantity, 
      this.rawMatsForm.value.MinimumWeight, 
      this.userID
    );

    authObs.subscribe(response =>{

        this.submitLoading = false;

        if( response === 1) {

            this.visible = false;
            this.MessageService.add({ 
                severity: 'success', 
                summary: 'Success', 
                detail:'Successfully recorded!', 
                life: 3000 
            });
            this.onGetData();
            this.onToggleDialog();
        } 
        else if ( response === 2) {

            this.visible = false;
            this.MessageService.add({ 
                severity: 'success', 
                summary: 'Success', 
                detail: 'Successfully updated!', 
                life: 3000 
            });
            this.onGetData();
            this.onToggleDialog();
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


