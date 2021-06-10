import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadboardComponent } from './loadboard.component';

describe('LoadboardComponent', () => {
  let component: LoadboardComponent;
  let fixture: ComponentFixture<LoadboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
