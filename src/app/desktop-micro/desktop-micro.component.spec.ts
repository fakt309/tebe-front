import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchMicroComponent } from './touch-micro.component';

describe('TouchMicroComponent', () => {
  let component: TouchMicroComponent;
  let fixture: ComponentFixture<TouchMicroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchMicroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchMicroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
