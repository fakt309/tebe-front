import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopPageBoxComponent } from './desktop-page-box.component';

describe('DesktopPageBoxComponent', () => {
  let component: DesktopPageBoxComponent;
  let fixture: ComponentFixture<DesktopPageBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopPageBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopPageBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
