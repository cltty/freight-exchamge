import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportShipperComponent } from './report-shipper.component';

describe('ReportShipperComponent', () => {
  let component: ReportShipperComponent;
  let fixture: ComponentFixture<ReportShipperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportShipperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportShipperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
