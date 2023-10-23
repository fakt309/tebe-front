import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopListPlatformsComponent } from './desktop-list-platforms.component';

describe('DesktopListPlatformsComponent', () => {
  let component: DesktopListPlatformsComponent;
  let fixture: ComponentFixture<DesktopListPlatformsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopListPlatformsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopListPlatformsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
