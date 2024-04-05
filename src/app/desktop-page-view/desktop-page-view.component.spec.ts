import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopPageViewComponent } from './desktop-page-view.component';

describe('DesktopPageViewComponent', () => {
  let component: DesktopPageViewComponent;
  let fixture: ComponentFixture<DesktopPageViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopPageViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopPageViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
