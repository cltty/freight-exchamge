import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadBookFailedDialogComponent } from './load-book-failed-dialog.component';

describe('LoadBookFailedDialogComponent', () => {
  let component: LoadBookFailedDialogComponent;
  let fixture: ComponentFixture<LoadBookFailedDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadBookFailedDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadBookFailedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
