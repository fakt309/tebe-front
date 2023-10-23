import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchScrollFragmentsComponent } from './touch-scroll-fragments.component';

describe('TouchScrollFragmentsComponent', () => {
  let component: TouchScrollFragmentsComponent;
  let fixture: ComponentFixture<TouchScrollFragmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchScrollFragmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchScrollFragmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
