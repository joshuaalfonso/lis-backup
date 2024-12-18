import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RawMaterialsService } from 'src/app/raw-materials/raw-materials.service';
import { SupplierService } from 'src/app/supplier/supplier.service';
import { RawMatsInspectionService } from '../../rawmats-inspection.service';

@Component({
  selector: 'app-rawmats-inspection-form',
  templateUrl: './rawmats-inspection-form.component.html',
  styleUrls: ['./rawmats-inspection-form.component.css']
})
export class RawmatsInspectionFormComponent implements OnInit, OnDestroy {

  @Input() visible: boolean = false;
  @Output() toggleDialog = new EventEmitter<void>();

  submitLoading: boolean = false;

  rawMaterials: any[] = [];
  supplier: any[] = [];
  analysisInformation: any[] = [];

  rawMatsInspectionForm!: FormGroup;

  subscriptions: Subscription = new Subscription;


  constructor(
    private SupplierService: SupplierService,
    private RawMaterialService: RawMaterialsService,
    private RawMatsInspectionService: RawMatsInspectionService
  ) {}


  ngOnInit(): void {

    this.rawMatsInspectionForm = new FormGroup({
      'InspectionReportID': new FormControl(0),
      'DeliveryTypeID': new FormControl(null),
      'EffectiveDate': new FormControl(null),
      'VersionNo': new FormControl(null),
      'InspectionDate': new FormControl(null, Validators.required),
      'SampleCode': new FormControl(null, Validators.required),
      'RawMaterialID': new FormControl(null, Validators.required),
      'SupplierID': new FormControl(null, Validators.required),
      'DRNumber': new FormControl(null, Validators.required),
      'PlateNo': new FormControl(null, Validators.required),
      'ContainerNumber': new FormControl(null, Validators.required),
      'TimeOfSampling': new FormControl(null, Validators.required),
      'FinalResultID': new FormControl(null),
      'DateTimeReleased': new FormControl(null),
      'Remarks': new FormControl(null),
      'UserID': new FormControl(0, Validators.required),
    })


    this.getRawMaterials();
    this.getSupplier();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onSubmit() {
    console.log(this.rawMatsInspectionForm.value);
    console.log(this.analysisInformation);
    
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
            return item = {...item, Result: null}
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

  

}


