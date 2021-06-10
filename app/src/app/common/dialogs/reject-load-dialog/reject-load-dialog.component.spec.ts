import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectLoadDialogComponent } from './reject-load-dialog.component';

describe('RejectLoadDialogComponent', () => {
  let component: RejectLoadDialogComponent;
  let fixture: ComponentFixture<RejectLoadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectLoadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectLoadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
