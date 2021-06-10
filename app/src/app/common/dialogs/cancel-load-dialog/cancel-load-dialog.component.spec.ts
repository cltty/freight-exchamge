import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelLoadDialogComponent } from './cancel-load-dialog.component';

describe('CancelLoadDialogComponent', () => {
  let component: CancelLoadDialogComponent;
  let fixture: ComponentFixture<CancelLoadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelLoadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelLoadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
