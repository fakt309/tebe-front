import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchPageCreateStage3Component } from './touch-page-create-stage3.component';

describe('TouchPageCreateStage3Component', () => {
  let component: TouchPageCreateStage3Component;
  let fixture: ComponentFixture<TouchPageCreateStage3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchPageCreateStage3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchPageCreateStage3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
