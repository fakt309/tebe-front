import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchDrawSvgComponent } from './touch-draw-svg.component';

describe('TouchDrawSvgComponent', () => {
  let component: TouchDrawSvgComponent;
  let fixture: ComponentFixture<TouchDrawSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchDrawSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchDrawSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
