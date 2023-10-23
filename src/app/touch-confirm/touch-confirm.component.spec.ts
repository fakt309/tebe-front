import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchConfirmComponent } from './touch-confirm.component';

describe('TouchConfirmComponent', () => {
  let component: TouchConfirmComponent;
  let fixture: ComponentFixture<TouchConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
