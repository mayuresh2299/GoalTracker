import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyGoals } from './daily-goals';

describe('DailyGoals', () => {
  let component: DailyGoals;
  let fixture: ComponentFixture<DailyGoals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyGoals],
    }).compileComponents();

    fixture = TestBed.createComponent(DailyGoals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
