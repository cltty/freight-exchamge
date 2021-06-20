import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLoadDialogComponent } from './new-load-dialog.component';

describe('NewLoadDialogComponent', () => {
  let component: NewLoadDialogComponent;
  let fixture: ComponentFixture<NewLoadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewLoadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLoadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
