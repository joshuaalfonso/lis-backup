import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent {

  @Input() selectedOption: number = 1;
  @Output() setOption: EventEmitter<number> = new EventEmitter<number>();

  tabChange(event: any) {
    let tabValue = +event.target.value;

    // console.log(selectedOption)
    this.setOption.emit(tabValue);
  }

}
