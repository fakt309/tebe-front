import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopConfirmComponent } from './desktop-confirm.component';

describe('DesktopConfirmComponent', () => {
  let component: DesktopConfirmComponent;
  let fixture: ComponentFixture<DesktopConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
