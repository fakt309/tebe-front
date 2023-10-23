import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopEditGiftComponent } from './desktop-edit-gift.component';

describe('DesktopEditGiftComponent', () => {
  let component: DesktopEditGiftComponent;
  let fixture: ComponentFixture<DesktopEditGiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopEditGiftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopEditGiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
