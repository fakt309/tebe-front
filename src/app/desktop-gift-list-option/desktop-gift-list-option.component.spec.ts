import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopGiftListOptionComponent } from './desktop-gift-list-option.component';

describe('DesktopGiftListOptionComponent', () => {
  let component: DesktopGiftListOptionComponent;
  let fixture: ComponentFixture<DesktopGiftListOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopGiftListOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopGiftListOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
