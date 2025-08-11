import { Component } from '@angular/core';
import { Message } from 'primeng/api';
import { Subscription, take } from 'rxjs';
import { RawMaterialsService } from 'src/app/raw-materials/raw-materials.service';
import { RawMatsInspectionService } from 'src/app/lab/rawmats-inspection/rawmats-inspection.service';
import { AuthService } from 'src/app/auth/auth.service';
import { RawMaterialStandardService } from './raw-material-standard.service';

@Component({
  selector: 'app-raw-material-standard',
  templateUrl: './raw-material-standard.component.html',
  styleUrls: ['./raw-material-standard.component.css']
})
export class RawMaterialStandardComponent {

  rawMaterials: any[] = [];
  rawMaterialStandard: any[] = [];
  isLoading: boolean = false;
  errorMessage: Message[] = [];

  parameters: any[] = [];

  subsciprtions: Subscription = new Subscription;

  userID!: string;

  visible: boolean = false;

  selectedRow: any;

  constructor(
    private rawMaterialStandardService: RawMaterialStandardService,
    private rawMaterialService: RawMaterialsService,
    private rawmatsInnspectionService: RawMatsInspectionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void { 
    this.getUser();
    this.getRawMaterialList();
    this.getParameterList();
    this.getRawMaterialStandard();
  }

  ngOnDestroy(): void {
    this.subsciprtions.unsubscribe();
  }

  getUser() {
    this.authService.user.pipe(take(1)).subscribe(user => {
      if (user) {
          this.userID = user.user_id;
      }
    })
  }

  getRawMaterialList() {
    this.subsciprtions.add(
      this.rawMaterialService.getRawMatsData().subscribe(
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
          // console.log(response);
          this.parameters = response;
        },
        error => {
          console.log(error)
        }
      )
    )
  }

  getRawMaterialStandard() {
    this.subsciprtions.add(
      this.rawMaterialStandardService.getRawMaterialStandard().subscribe(
        response => {
          this.rawMaterialStandard = response;
        },
        error => {
          console.log(error)
        }
      )
    )
  }

  showDialog(data = null) {
    console.log(data)
    this.visible = true;
    this.selectedRow = data;
  }

  closeDialog() {
    this.visible = false;
    this.selectedRow = null;
  }

}
