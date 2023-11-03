import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopRadioComponent } from './desktop-radio.component';

describe('DesktopRadioComponent', () => {
  let component: DesktopRadioComponent;
  let fixture: ComponentFixture<DesktopRadioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopRadioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
