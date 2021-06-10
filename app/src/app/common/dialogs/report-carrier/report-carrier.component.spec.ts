import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCarrierComponent } from './report-carrier.component';

describe('ReportCarrierComponent', () => {
  let component: ReportCarrierComponent;
  let fixture: ComponentFixture<ReportCarrierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportCarrierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCarrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
