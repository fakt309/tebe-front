import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopButtonComponent } from './desktop-button.component';

describe('DesktopButtonComponent', () => {
  let component: DesktopButtonComponent;
  let fixture: ComponentFixture<DesktopButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
