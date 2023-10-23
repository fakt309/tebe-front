import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchRefreshComponent } from './touch-refresh.component';

describe('TouchRefreshComponent', () => {
  let component: TouchRefreshComponent;
  let fixture: ComponentFixture<TouchRefreshComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchRefreshComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchRefreshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
