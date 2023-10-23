import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopWebcamVideoComponent } from './desktop-webcam-video.component';

describe('DesktopWebcamVideoComponent', () => {
  let component: DesktopWebcamVideoComponent;
  let fixture: ComponentFixture<DesktopWebcamVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopWebcamVideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopWebcamVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
