import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopLockComponent } from './desktop-lock.component';

describe('DesktopLockComponent', () => {
  let component: DesktopLockComponent;
  let fixture: ComponentFixture<DesktopLockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopLockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopLockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
