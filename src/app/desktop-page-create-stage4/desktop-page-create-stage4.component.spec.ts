import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopPageCreateStage4Component } from './desktop-page-create-stage4.component';

describe('DesktopPageCreateStage4Component', () => {
  let component: DesktopPageCreateStage4Component;
  let fixture: ComponentFixture<DesktopPageCreateStage4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopPageCreateStage4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopPageCreateStage4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
