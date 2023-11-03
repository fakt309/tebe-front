import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopPageCreateStage2Component } from './desktop-page-create-stage2.component';

describe('DesktopPageCreateStage2Component', () => {
  let component: DesktopPageCreateStage2Component;
  let fixture: ComponentFixture<DesktopPageCreateStage2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopPageCreateStage2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopPageCreateStage2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
