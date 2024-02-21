import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopPageCreateStage3Component } from './desktop-page-create-stage3.component';

describe('DesktopPageCreateStage3Component', () => {
  let component: DesktopPageCreateStage3Component;
  let fixture: ComponentFixture<DesktopPageCreateStage3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopPageCreateStage3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopPageCreateStage3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
