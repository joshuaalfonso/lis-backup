import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsTransferComponent } from './cards-transfer.component';

describe('CardsTransferComponent', () => {
  let component: CardsTransferComponent;
  let fixture: ComponentFixture<CardsTransferComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardsTransferComponent]
    });
    fixture = TestBed.createComponent(CardsTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
