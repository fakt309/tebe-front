import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchListenComponent } from './touch-listen.component';

describe('TouchListenComponent', () => {
  let component: TouchListenComponent;
  let fixture: ComponentFixture<TouchListenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchListenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchListenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
