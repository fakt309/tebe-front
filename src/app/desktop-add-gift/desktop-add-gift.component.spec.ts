import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopAddGiftComponent } from './desktop-add-gift.component';

describe('DesktopAddGiftComponent', () => {
  let component: DesktopAddGiftComponent;
  let fixture: ComponentFixture<DesktopAddGiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopAddGiftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopAddGiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
