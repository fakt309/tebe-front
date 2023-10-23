import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchWatchComponent } from './touch-watch.component';

describe('TouchWatchComponent', () => {
  let component: TouchWatchComponent;
  let fixture: ComponentFixture<TouchWatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchWatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchWatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
