import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchGiftlistaddOptionComponent } from './touch-giftlistadd-option.component';

describe('TouchGiftlistaddOptionComponent', () => {
  let component: TouchGiftlistaddOptionComponent;
  let fixture: ComponentFixture<TouchGiftlistaddOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchGiftlistaddOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchGiftlistaddOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
