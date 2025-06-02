import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrienndsComponent } from './friennds.component';

describe('FrienndsComponent', () => {
  let component: FrienndsComponent;
  let fixture: ComponentFixture<FrienndsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrienndsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrienndsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
