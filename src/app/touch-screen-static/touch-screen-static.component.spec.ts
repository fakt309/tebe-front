import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchScreenStaticComponent } from './touch-screen-static.component';

describe('TouchScreenStaticComponent', () => {
  let component: TouchScreenStaticComponent;
  let fixture: ComponentFixture<TouchScreenStaticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchScreenStaticComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchScreenStaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
