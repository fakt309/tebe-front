import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgMicroComponent } from './micro-svg.component';

describe('MicroSvgComponent', () => {
  let component: SvgMicroComponent;
  let fixture: ComponentFixture<MicroSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SvgMicroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgMicroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
