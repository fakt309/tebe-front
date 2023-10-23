import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchSignGreetingcardComponent } from './touch-sign-greetingcard.component';

describe('TouchSignGreetingcardComponent', () => {
  let component: TouchSignGreetingcardComponent;
  let fixture: ComponentFixture<TouchSignGreetingcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchSignGreetingcardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchSignGreetingcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
