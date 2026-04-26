import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalCalendar } from './goal-calendar';

describe('GoalCalendar', () => {
  let component: GoalCalendar;
  let fixture: ComponentFixture<GoalCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalCalendar],
    }).compileComponents();

    fixture = TestBed.createComponent(GoalCalendar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
