import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSucessfulDialogComponent } from './register-sucessful-dialog.component';

describe('RegisterSucessfulDialogComponent', () => {
  let component: RegisterSucessfulDialogComponent;
  let fixture: ComponentFixture<RegisterSucessfulDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterSucessfulDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterSucessfulDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
