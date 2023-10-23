import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchErrorComponent } from './touch-error.component';

describe('TouchErrorComponent', () => {
  let component: TouchErrorComponent;
  let fixture: ComponentFixture<TouchErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
