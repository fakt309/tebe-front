import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchTrimComponent } from './touch-trim.component';

describe('TouchTrimComponent', () => {
  let component: TouchTrimComponent;
  let fixture: ComponentFixture<TouchTrimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchTrimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchTrimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
