import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RawMaterialsService } from '../../raw-materials/raw-materials.service';
import { RawMatsInspectionService } from './rawmats-inspection.service';

@Component({
  selector: 'app-rawmats-inspection',
  templateUrl: './rawmats-inspection.component.html',
  styleUrls: ['./rawmats-inspection.component.css']
})
export class RawmatsInspectionComponent implements OnInit, OnDestroy{

  rawMatsInspection: any[] = [];
  analysisInformation: any[] = [];
  isLoading: boolean = false;

  rawMatsInspectionForm!: FormGroup;

  subscriptions: Subscription = new Subscription;
  visible: boolean = false;
  submitLoading: boolean = false;

  rawMaterials: any[] = [];
  parameterList: any[] = [];
  rawMatsParameters: any[] = [];

  minDate: Date = new Date();

  maxDate: Date = new Date();


  constructor(
    private RawMatsInspectionService: RawMatsInspectionService
  )  {}


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
      'DateTimeReleased': new FormControl(null, Validators.required),
      'Status': new FormControl(null),
      'Remarks': new FormControl(null),
      'UserID': new FormControl(0, Validators.required),
    })
    
    this.getInspectionList();
    this.getParameterList(); 

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getInspectionList() {

    this.subscriptions.add(
      this.RawMatsInspectionService.getInspectionList().subscribe(
        response => {
          this.rawMatsInspection = response;
          
        }
      )
    )

  }

  getParameterList() {

    this.subscriptions.add(
      this.RawMatsInspectionService.getParameterList().subscribe(
        response => {
          this.parameterList = response;
        }
      )
    )

  }


  showDialog() {
    this.rawMatsInspectionForm.reset();
    this.rawMatsInspectionForm.patchValue({
      InspectionReportID: 0,
      UserID: 0
    });
    this.analysisInformation = [];
    this.rawMatsParameters = [];

    this.visible = !this.visible;
    
  }

  onSelect(row: any) {
    this.showDialog();

    if (!row.RawMaterialID) return;

    this.getRawMaterialParameter(row.RawMaterialID);

    this.rawMatsInspectionForm.setValue({
      InspectionReportID: row.InspectionReportID,
      DeliveryTypeID: row.DeliveryTypeID,
      EffectiveDate: row.EffectiveDate,
      VersionNo: row.VersionNo,
      InspectionDate: new Date(row.InspectionDate?.date) || null,
      SampleCode: row.SampleCode,
      RawMaterialID: row.RawMaterialID,
      SupplierID: row.SupplierID,
      DRNumber: row.DRNumber,
      PlateNo: row.PlateNo,
      ContainerNumber: row.ContainerNumber,
      TimeOfSampling: new Date(row.TimeOfSampling?.date) || null,
      FinalResultID: 0,
      DateTimeReleased: new Date(row.DateTimeReleased?.date) || null,
      Status: row.Status,
      Remarks: row.Remarks,
      UserID: 0
    })
    
    console.log(row.Result);
    this.analysisInformation = [...row.Result]
    
  }

  getRawMaterialParameter(rawMatsID: any) {

    this.subscriptions.add(
      this.RawMatsInspectionService.getRawMatsStandard(rawMatsID).subscribe(
        response => {
          this.rawMatsParameters = response;
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
          // console.log(response);
          this.rawMatsParameters = response;
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


}
