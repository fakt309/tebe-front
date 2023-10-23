import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchEmptyGiftslistComponent } from './touch-empty-giftslist.component';

describe('TouchEmptyGiftslistComponent', () => {
  let component: TouchEmptyGiftslistComponent;
  let fixture: ComponentFixture<TouchEmptyGiftslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchEmptyGiftslistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchEmptyGiftslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
