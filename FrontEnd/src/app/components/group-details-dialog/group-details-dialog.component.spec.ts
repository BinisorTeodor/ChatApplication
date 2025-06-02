import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDetailsDialogComponent } from './group-details-dialog.component';

describe('GroupDetailsDialogComponent', () => {
  let component: GroupDetailsDialogComponent;
  let fixture: ComponentFixture<GroupDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupDetailsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
