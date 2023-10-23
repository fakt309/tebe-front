import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgHandleComponent } from './svg-handle.component';

describe('SvgHandleComponent', () => {
  let component: SvgHandleComponent;
  let fixture: ComponentFixture<SvgHandleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SvgHandleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgHandleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
