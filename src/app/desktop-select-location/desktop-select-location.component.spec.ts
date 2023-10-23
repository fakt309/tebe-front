import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchSelectLocationComponent } from './touch-select-location.component';

describe('TouchSelectLocationComponent', () => {
  let component: TouchSelectLocationComponent;
  let fixture: ComponentFixture<TouchSelectLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchSelectLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchSelectLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
