import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchMenuComponent } from './touch-menu.component';

describe('TouchMenuComponent', () => {
  let component: TouchMenuComponent;
  let fixture: ComponentFixture<TouchMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
