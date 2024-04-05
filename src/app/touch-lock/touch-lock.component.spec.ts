import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchLockComponent } from './touch-lock.component';

describe('TouchLockComponent', () => {
  let component: TouchLockComponent;
  let fixture: ComponentFixture<TouchLockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchLockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchLockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
