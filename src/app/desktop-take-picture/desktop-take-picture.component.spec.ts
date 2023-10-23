import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchTakePictureComponent } from './touch-take-picture.component';

describe('TouchTakePictureComponent', () => {
  let component: TouchTakePictureComponent;
  let fixture: ComponentFixture<TouchTakePictureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchTakePictureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchTakePictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
