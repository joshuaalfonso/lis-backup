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

  minDate: Date = new Date();

  maxDate: Date = new Date();


  constructor(

  )  {}


  ngOnInit(): void {

    
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


  showDialog() {
    this.visible = !this.visible;
  }



}
