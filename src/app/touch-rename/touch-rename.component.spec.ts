import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchRenameComponent } from './touch-rename.component';

describe('TouchRenameComponent', () => {
  let component: TouchRenameComponent;
  let fixture: ComponentFixture<TouchRenameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchRenameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchRenameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
