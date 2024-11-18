import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-rawmats',
  templateUrl: './dashboard-rawmats.component.html',
  styleUrls: ['./dashboard-rawmats.component.css']
})
export class DashboardRawmatsComponent {

  @Input() rawMaterial: any[] = [];
  @Input() rawmatsLoading:boolean = false;

}
