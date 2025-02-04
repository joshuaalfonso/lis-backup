import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RawMaterialsService } from 'src/app/raw-materials/raw-materials.service';
import { SupplierService } from 'src/app/supplier/supplier.service';
import { RawMatsInspectionService } from '../../rawmats-inspection.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-rawmats-inspection-form',
  templateUrl: './rawmats-inspection-form.component.html',
  styleUrls: ['./rawmats-inspection-form.component.css']
})
export class RawmatsInspectionFormComponent implements OnInit, OnDestroy {

  @Input() visible: boolean = false;
  @Output() toggleDialog = new EventEmitter<void>();
  @Output() getInspectionList = new EventEmitter<void>();

  submitLoading: boolean = false;

  rawMaterials: any[] = [];
  supplier: any[] = [];
  @Input() analysisInformation: any[] = [];

  @Input() rawMatsInspectionForm!: FormGroup;

  subscriptions: Subscription = new Subscription;

  positiveNegative: any[] = [];


  constructor(
    private SupplierService: SupplierService,
    private RawMaterialService: RawMaterialsService,
    private RawMatsInspectionService: RawMatsInspectionService,
    private MessageService: MessageService
  ) {}


  ngOnInit(): void {

    this.positiveNegative = [
      {
        label: 'Negative',
        value: 0
      },
      {
        label: 'Positive',
        value: 1
      },
    ]


    this.getRawMaterials();
    this.getSupplier();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onSubmit() {
    // console.log(this.rawMatsInspectionForm.value);
    // console.log(this.analysisInformation);

    if (this.rawMatsInspectionForm.invalid) return;

    let status = 0;

    this.analysisInformation.forEach(
      item => {
        
        if (item.Permission === 1) {
          status = 1;
        }
        
      }
    )

    const data = {
      ...this.rawMatsInspectionForm.value,
      InspectionDate: this.rawMatsInspectionForm.value.InspectionDate?.toLocaleDateString() || null,
      TimeOfSampling: this.rawMatsInspectionForm.value.TimeOfSampling?.toLocaleString() || null,
      DateTimeReleased: this.rawMatsInspectionForm.value.DateTimeReleased?.toLocaleString() || null,

      EffectiveDate: null,
      Parameters: this.analysisInformation,
      Status: status
    }
    
    // console.log(data);
    // console.log(this.analysisInformation);
    

    this.RawMatsInspectionService.createInspection(data).subscribe(
      response => {
        console.log(response)

        if (response === 1) {
          this.getInspectionList.emit();
          this.toggleDialog.emit();
          this.MessageService.add({ 
            severity: 'success', 
            summary: 'Success', 
            detail: 'Successfully Created!', 
            life: 3000 
          });
        }

        if (response === 2) {
          this.getInspectionList.emit();
          this.toggleDialog.emit();
          this.MessageService.add({ 
            severity: 'success', 
            summary: 'Success', 
            detail: 'Successfully Updated!', 
            life: 3000 
          });
        }
      },
      err => {
        console.error(err);
      }
    )
    
    
  }

  getRawMaterials() {
    this.subscriptions.add(
      this.RawMaterialService.getRawMatsData().subscribe(
        response => {
          this.rawMaterials = response
        },
        error => {
          console.error('There was an error fetching raw materials' + error)
        }
      )
    )
  }

  getSupplier() {
    this.subscriptions.add(
      this.SupplierService.getSupplierData().subscribe(
        response => {
          this.supplier = response;
        },
        error => {
          console.error('There was an error fetching supplier' + error);
        }
      )
    )
  }

  getStandard(rawMatsID: any) {
    if (!rawMatsID) {
      this.analysisInformation = []; 
      return;
    }

    this.subscriptions.add(
      this.RawMatsInspectionService.getRawMatsStandard(rawMatsID).subscribe(
        response => {
          console.log(response);

          this.analysisInformation = response.map((item: any) => {
            return item = {...item, Result: null, Permission: null, ParameterResultID: 0}
          })

        },
        error => {
          console.log(error)
        }
      )
    )

  }

  onToggleDialog() {
    this.rawMatsInspectionForm.reset();
    this.rawMatsInspectionForm.patchValue({
      InspectionReportID: 0,
      UserID: 0
    });
    this.analysisInformation = [];
    this.toggleDialog.emit();
  }

  getSeverity (row: any) {

    if (row.ParameterBoolean === 0) {
      return row.Result > (+row.Rejection || +row.Standard)  ? 'bg-red-200' : null
    }

    if (row.ParameterBoolean === 1) {
      return row.Result > 0 ? 'bg-red-200' : null
    }

    return null

  }

  validateResult(index: number) {
    
    
    if (this.analysisInformation[index].boolean === 0) {

      if (this.analysisInformation[index].Result > +this.analysisInformation[index].Value) {
        this.analysisInformation[index].Permission = 1;
      } else {
        this.analysisInformation[index].Permission = 0;
      }

    } 

    else if (this.analysisInformation[index].boolean === 1) {

      if (this.analysisInformation[index].Result === 1 ) {

        this.analysisInformation[index].Permission = 1;

      } else {
        this.analysisInformation[index].Permission = 0;
      }

    }
  
    // console.log(this.analysisInformation);    

  }

}


