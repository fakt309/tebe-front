import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageBoxComponent } from './page-box.component';

describe('PageBoxComponent', () => {
  let component: PageBoxComponent;
  let fixture: ComponentFixture<PageBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
