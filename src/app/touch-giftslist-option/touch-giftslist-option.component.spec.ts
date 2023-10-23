import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchGiftslistOptionComponent } from './touch-giftslist-option.component';

describe('TouchGiftslistOptionComponent', () => {
  let component: TouchGiftslistOptionComponent;
  let fixture: ComponentFixture<TouchGiftslistOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchGiftslistOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchGiftslistOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
