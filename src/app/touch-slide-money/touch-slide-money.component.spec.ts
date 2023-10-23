import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchSlideMoneyComponent } from './touch-slide-money.component';

describe('TouchSlideMoneyComponent', () => {
  let component: TouchSlideMoneyComponent;
  let fixture: ComponentFixture<TouchSlideMoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchSlideMoneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchSlideMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
