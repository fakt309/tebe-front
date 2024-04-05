import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchPageCreateStage4Component } from './touch-page-create-stage4.component';

describe('TouchPageCreateStage4Component', () => {
  let component: TouchPageCreateStage4Component;
  let fixture: ComponentFixture<TouchPageCreateStage4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchPageCreateStage4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchPageCreateStage4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
