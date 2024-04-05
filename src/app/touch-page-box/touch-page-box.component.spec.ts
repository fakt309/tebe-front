import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchPageLinkComponent } from './touch-page-link.component';

describe('TouchPageLinkComponent', () => {
  let component: TouchPageLinkComponent;
  let fixture: ComponentFixture<TouchPageLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchPageLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchPageLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
