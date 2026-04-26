import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllGoals } from './all-goals';

describe('AllGoals', () => {
  let component: AllGoals;
  let fixture: ComponentFixture<AllGoals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllGoals],
    }).compileComponents();

    fixture = TestBed.createComponent(AllGoals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
