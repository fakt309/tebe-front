import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchOptionTrimlistComponent } from './touch-option-trimlist.component';

describe('TouchOptionTrimlistComponent', () => {
  let component: TouchOptionTrimlistComponent;
  let fixture: ComponentFixture<TouchOptionTrimlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchOptionTrimlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchOptionTrimlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
