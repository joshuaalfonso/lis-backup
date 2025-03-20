import { Component } from '@angular/core';
import { Location } from '@angular/common';


@Component({
  selector: 'app-bl-overview',
  templateUrl: './bl-overview.component.html',
  styleUrls: ['./bl-overview.component.css']
})
export class BlOverviewComponent {


  constructor(private location: Location) {}


  goBack() {
    this.location.back();
  }

}
