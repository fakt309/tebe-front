import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchScrollComponent } from './touch-scroll.component';

describe('TouchScrollComponent', () => {
  let component: TouchScrollComponent;
  let fixture: ComponentFixture<TouchScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchScrollComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
