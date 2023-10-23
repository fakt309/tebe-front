import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchMoneyPackComponent } from './touch-money-pack.component';

describe('TouchMoneyPackComponent', () => {
  let component: TouchMoneyPackComponent;
  let fixture: ComponentFixture<TouchMoneyPackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchMoneyPackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchMoneyPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
