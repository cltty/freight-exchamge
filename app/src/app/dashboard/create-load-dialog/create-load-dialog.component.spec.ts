import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLoadDialogComponent } from './create-load-dialog.component';

describe('CreateLoadDialogComponent', () => {
  let component: CreateLoadDialogComponent;
  let fixture: ComponentFixture<CreateLoadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLoadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLoadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
