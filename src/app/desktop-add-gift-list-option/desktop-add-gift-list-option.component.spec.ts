import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopAddGiftListOptionComponent } from './desktop-add-gift-list-option.component';

describe('DesktopAddGiftListOptionComponent', () => {
  let component: DesktopAddGiftListOptionComponent;
  let fixture: ComponentFixture<DesktopAddGiftListOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopAddGiftListOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopAddGiftListOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
