import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUploadedFileDialogComponent } from './delete-uploaded-file-dialog.component';

describe('DeleteUploadedFileDialogComponent', () => {
  let component: DeleteUploadedFileDialogComponent;
  let fixture: ComponentFixture<DeleteUploadedFileDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteUploadedFileDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteUploadedFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
