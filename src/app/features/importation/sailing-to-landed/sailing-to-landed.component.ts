import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { ImportationService } from 'src/app/pages/importation/importation.service';

@Component({
  selector: 'app-sailing-to-landed',
  templateUrl: './sailing-to-landed.component.html',
  styleUrls: ['./sailing-to-landed.component.css']
})
export class SailingToLandedComponent implements OnChanges{

  @Input() visibleLandedForm: boolean = false;
  @Input() selectedShippingID: number = 0;
  @Output() showLandedDialog = new EventEmitter;
  @Output() closeLandedDialog = new EventEmitter;
  @Output() handeRemoveShipping = new EventEmitter;

  landedForm = new FormGroup({
    'ShippingTransactionID': new FormControl(0),
    'ATA': new FormControl(null as Date | null, Validators.required)
  })

  constructor(
    private importationService: ImportationService,
    private messageService: MessageService
  ) {}

  ngOnChanges(): void {
    if (this.selectedShippingID !== 0) {
      this.landedForm.patchValue({
        ShippingTransactionID: this.selectedShippingID
      })
    } else {
      this.landedForm.reset();
    }
  }

  onSubmit() {

    if (!this.landedForm.valid && !this.selectedShippingID) {
      alert('Invalid form');
      return;
    }

    const data = {
      ShippingTransactionID: this.selectedShippingID,
      ATA: this.landedForm.value.ATA?.toLocaleDateString() || null,
    }

    this.importationService.sailingToLanded(data).pipe(take(1)).subscribe(
      response => {
        console.log(response)
        if (response === 2) {
          this.messageService.add({
            severity: 'success', 
            summary: 'Success', 
            detail: 'Successfully updated!', 
            life: 3000 
          })
          this.handeRemoveShipping.emit(this.selectedShippingID);
          this.closeLandedDialog.emit();
        }
      },
      err => {
        console.log(err)
        this.messageService.add({
          severity: 'error', 
          summary: 'Danger', 
          detail: 'An unkown error occured' ,
          life: 3000 
        })
      }
    )

  }

}
