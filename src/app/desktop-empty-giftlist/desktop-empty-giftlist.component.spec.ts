import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopEmptyGiftlistComponent } from './desktop-empty-giftlist.component';

describe('DesktopEmptyGiftlistComponent', () => {
  let component: DesktopEmptyGiftlistComponent;
  let fixture: ComponentFixture<DesktopEmptyGiftlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopEmptyGiftlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopEmptyGiftlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
