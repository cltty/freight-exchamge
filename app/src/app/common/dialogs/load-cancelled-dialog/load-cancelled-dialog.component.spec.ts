import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadCancelledDialogComponent } from './load-cancelled-dialog.component';

describe('LoadCancelledDialogComponent', () => {
  let component: LoadCancelledDialogComponent;
  let fixture: ComponentFixture<LoadCancelledDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadCancelledDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadCancelledDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
