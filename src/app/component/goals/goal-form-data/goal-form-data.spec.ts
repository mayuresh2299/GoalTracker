import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalFormData } from './goal-form-data';

describe('GoalFormData', () => {
  let component: GoalFormData;
  let fixture: ComponentFixture<GoalFormData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalFormData],
    }).compileComponents();

    fixture = TestBed.createComponent(GoalFormData);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
