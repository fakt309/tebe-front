import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopSelectComponent } from './desktop-select.component';

describe('DesktopSelectComponent', () => {
  let component: DesktopSelectComponent;
  let fixture: ComponentFixture<DesktopSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
