import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, take } from 'rxjs';
import { RawMaterialsService } from '../../raw-materials/raw-materials.service';
import { RawMatsInspectionService } from './rawmats-inspection.service';
import { AuthService } from 'src/app/auth/auth.service';
import { SystemLogsService } from 'src/app/system-logs/system-logs.service';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-rawmats-inspection',
  templateUrl: './rawmats-inspection.component.html',
  styleUrls: ['./rawmats-inspection.component.css']
})
export class RawmatsInspectionComponent implements OnInit, OnDestroy{

  rawMatsInspection: any[] = [];
  analysisInformation: any[] = [];
  isLoading: boolean = false;
  rawMatsInspectionError: Message[] = [];

  rawMatsInspectionForm!: FormGroup;

  subscriptions: Subscription = new Subscription;
  visible: boolean = false;
  submitLoading: boolean = false;

  rawMaterials: any[] = [];
  parameterList: any[] = [];
  rawMatsParameters: any[] = [];

  minDate: Date = new Date();

  maxDate: Date = new Date();
  userID!: string;

  constructor(
    private RawMatsInspectionService: RawMatsInspectionService,
    private AuthService: AuthService,
    private SystemLogsService: SystemLogsService
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
    this.getUser();
    this.getInspectionList();
    this.getParameterList(); 
    this.logInspectionView();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getUser() {
    this.AuthService.user.pipe(take(1)).subscribe(user => {
      if (user) {
          this.userID = user.user_id;
      }
    })
  }

  getInspectionList() {
    this.isLoading = true;

    this.subscriptions.add(
      this.RawMatsInspectionService.getInspectionList().subscribe(
        response => {
          this.rawMatsInspection = response;
          this.isLoading = false
        },
        error => {
          this.rawMatsInspectionError = [ { severity: 'error', detail: 'There was an error fetching data' }]
          console.log(error);
          this.isLoading = false
        },
        () => {
          this.rawMatsInspectionError = [];
        }
      )
    )

  }

  logInspectionView() {

    if (!this.userID) {
        alert('No logged in user');
        return
    }

    const data = {
        UserID: this.userID,
        TableName: 'Raw Material Inspection'
    }

    this.SystemLogsService.sytemLogView(data).pipe(take(1)).subscribe(
        response => {
            // console.log(response);
        },
        error => {
            console.log(error);
            this.rawMatsInspectionError = [ { severity: 'error', detail: 'Unkown error occured' }]
        }
    );

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
