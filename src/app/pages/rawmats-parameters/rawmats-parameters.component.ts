import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RawMatsParametersService } from './rawmats-parameters.service';
import { Message } from 'primeng/api';
import { RawMatsInspectionService } from 'src/app/lab/rawmats-inspection/rawmats-inspection.service';

@Component({
  selector: 'app-rawmats-parameters',
  templateUrl: './rawmats-parameters.component.html',
  styleUrls: ['./rawmats-parameters.component.css']
})
export class RawmatsParametersComponent implements OnInit, OnDestroy{

  rawMaterials = [] = [];
  isLoading: boolean = false;
  errorMessage: Message[] = [];

  parameters: any[] = [];

  subsciprtions: Subscription = new Subscription;

  constructor(
    private ramatsParametersService: RawMatsParametersService,
    private rawmatsInnspectionService: RawMatsInspectionService
  ) {}

  ngOnInit(): void { 
    this.getRawMatsParams();
    this.getParameterList();
  }

  ngOnDestroy(): void {
    this.subsciprtions.unsubscribe();
  }

  getRawMatsParams() {
    this.subsciprtions.add(
      this.ramatsParametersService.getRawMatsParams().subscribe(
        reponse => {
          this.rawMaterials = reponse;
          this.isLoading = false;
        },
        error => {
          console.log(error)
          this.errorMessage = [{ severity: 'error', detail: 'Unable to load raw material parameters.' },]
        }
      )
    )
  }

  getParameterList() {
    this.subsciprtions.add(
      this.rawmatsInnspectionService.getParameterList().subscribe(
        response => {
          console.log(response);
          this.parameters = response;
        },
        error => {
          console.log(error)
        }
      )
    )
  }

}
