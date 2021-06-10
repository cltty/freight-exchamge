import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadRejectedDialogComponent } from './load-rejected-dialog.component';

describe('LoadRejectedDialogComponent', () => {
  let component: LoadRejectedDialogComponent;
  let fixture: ComponentFixture<LoadRejectedDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadRejectedDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadRejectedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
