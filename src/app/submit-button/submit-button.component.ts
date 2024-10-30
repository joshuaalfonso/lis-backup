import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-submit-button',
  templateUrl: './submit-button.component.html',
  styleUrls: ['./submit-button.component.css']
})
export class SubmitButtonComponent {

  @Input() submitLoading: boolean = false; // Loading state
  @Input() form!: FormGroup; // FormGroup input

}
