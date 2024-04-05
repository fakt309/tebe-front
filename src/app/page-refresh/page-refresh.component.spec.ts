import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageRefreshComponent } from './page-refresh.component';

describe('PageRefreshComponent', () => {
  let component: PageRefreshComponent;
  let fixture: ComponentFixture<PageRefreshComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageRefreshComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageRefreshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
