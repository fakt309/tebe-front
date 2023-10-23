import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopListImagesComponent } from './desktop-list-images.component';

describe('DesktopListImagesComponent', () => {
  let component: DesktopListImagesComponent;
  let fixture: ComponentFixture<DesktopListImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopListImagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopListImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
