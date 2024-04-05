import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchPageViewComponent } from './touch-page-view.component';

describe('TouchPageViewComponent', () => {
  let component: TouchPageViewComponent;
  let fixture: ComponentFixture<TouchPageViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchPageViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchPageViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
