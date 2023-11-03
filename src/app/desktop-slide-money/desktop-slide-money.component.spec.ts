import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopSlideMoneyComponent } from './desktop-slide-money.component';

describe('DesktopSlideMoneyComponent', () => {
  let component: DesktopSlideMoneyComponent;
  let fixture: ComponentFixture<DesktopSlideMoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopSlideMoneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopSlideMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
