import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopInputNumberComponent } from './desktop-input-number.component';

describe('DesktopInputNumberComponent', () => {
  let component: DesktopInputNumberComponent;
  let fixture: ComponentFixture<DesktopInputNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopInputNumberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopInputNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
