import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferDetailComponent } from './transfer-detail.component';

describe('TransferDetailComponent', () => {
  let component: TransferDetailComponent;
  let fixture: ComponentFixture<TransferDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransferDetailComponent]
    });
    fixture = TestBed.createComponent(TransferDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
