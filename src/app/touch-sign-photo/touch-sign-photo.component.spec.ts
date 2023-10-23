import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchSignPhotoComponent } from './touch-sign-photo.component';

describe('TouchSignPhotoComponent', () => {
  let component: TouchSignPhotoComponent;
  let fixture: ComponentFixture<TouchSignPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchSignPhotoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchSignPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
