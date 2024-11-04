import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-raw-materials-modal',
  templateUrl: './raw-materials-modal.component.html',
  styleUrls: ['./raw-materials-modal.component.css']
})
export class RawMaterialsModalComponent {

  @Input() visible: boolean = false;
  @Input() modalHeader: string = '';
  @Input() rawMatsForm!: FormGroup;
  @Input() submitLoading: boolean = false;
  @Output() submit = new EventEmitter<void>();
  @Output() toggleDialog = new EventEmitter<void>();

  onSubmit() {
    this.submit.emit();
  }

  onToggleDialog() {
    this.toggleDialog.emit();
  }

}
