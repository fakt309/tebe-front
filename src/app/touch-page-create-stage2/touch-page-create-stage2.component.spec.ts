import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchPageCreateStage2Component } from './touch-page-create-stage2.component';

describe('TouchPageCreateStage2Component', () => {
  let component: TouchPageCreateStage2Component;
  let fixture: ComponentFixture<TouchPageCreateStage2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchPageCreateStage2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchPageCreateStage2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
