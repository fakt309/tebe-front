import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchDrawComponent } from './touch-draw.component';

describe('TouchDrawComponent', () => {
  let component: TouchDrawComponent;
  let fixture: ComponentFixture<TouchDrawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchDrawComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
