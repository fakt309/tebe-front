import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchTextCopyComponent } from './touch-text-copy.component';

describe('TouchTextCopyComponent', () => {
  let component: TouchTextCopyComponent;
  let fixture: ComponentFixture<TouchTextCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchTextCopyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchTextCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
