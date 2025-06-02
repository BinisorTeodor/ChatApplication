import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstWindowComponent } from './first-window.component';

describe('FirstWindowComponent', () => {
  let component: FirstWindowComponent;
  let fixture: ComponentFixture<FirstWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstWindowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
