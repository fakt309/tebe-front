import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchViewGiftComponent } from './touch-view-gift.component';

describe('TouchViewGiftComponent', () => {
  let component: TouchViewGiftComponent;
  let fixture: ComponentFixture<TouchViewGiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchViewGiftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchViewGiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
