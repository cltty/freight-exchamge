import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadBookedDialogComponent } from './load-booked-dialog.component';

describe('LoadBookedDialogComponent', () => {
  let component: LoadBookedDialogComponent;
  let fixture: ComponentFixture<LoadBookedDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadBookedDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadBookedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
