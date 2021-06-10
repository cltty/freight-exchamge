import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkAsReadDialogComponent } from './mark-as-read-dialog.component';

describe('MarkAsReadDialogComponent', () => {
  let component: MarkAsReadDialogComponent;
  let fixture: ComponentFixture<MarkAsReadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkAsReadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkAsReadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
