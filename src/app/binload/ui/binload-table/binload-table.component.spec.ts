import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BinloadTableComponent } from './binload-table.component';

describe('BinloadTableComponent', () => {
  let component: BinloadTableComponent;
  let fixture: ComponentFixture<BinloadTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BinloadTableComponent]
    });
    fixture = TestBed.createComponent(BinloadTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
