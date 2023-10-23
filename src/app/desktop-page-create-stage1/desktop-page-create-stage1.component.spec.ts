import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopPageCreateStage1Component } from './desktop-page-create-stage1.component';

describe('DesktopPageCreateStage1Component', () => {
  let component: DesktopPageCreateStage1Component;
  let fixture: ComponentFixture<DesktopPageCreateStage1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopPageCreateStage1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopPageCreateStage1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
