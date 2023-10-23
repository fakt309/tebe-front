import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopErrorComponent } from './desktop-error.component';

describe('DesktopErrorComponent', () => {
  let component: DesktopErrorComponent;
  let fixture: ComponentFixture<DesktopErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
