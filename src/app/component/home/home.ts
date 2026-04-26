import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AllGoals } from '../goals/all-goals/all-goals';
import { DailyGoals } from '../goals/daily-goals/daily-goals';
import { CreateGoal } from '../goals/create-goal/create-goal';
import { GoalListComponent } from '../goals/goal-list/goal-list';
import {GoalCalendarComponent} from '../goals/goal-calendar/goal-calendar';
import { GoalFormData, IGoalFormData } from '../goals/goal-form-data/goal-form-data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GoalListComponent, GoalFormData, GoalCalendarComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  user = "Mayuresh";
  private router = inject(Router);
  viewMode: 'all' | 'weekly' | 'daily' = 'all';
  showCreateGoal = false;
  editingGoal: IGoalFormData | null = null; // track which goal is being edited
  goals: IGoalFormData[] = [];
  showCalendar = false;
  selectedGoalForCalendar: IGoalFormData | null = null;

  openCalendarForGoal(goal: IGoalFormData): void {
    this.selectedGoalForCalendar = goal;
    this.showCalendar = true;
  }

  closeCalendar(): void {
    this.showCalendar = false;
    this.selectedGoalForCalendar = null;
  }

  ngOnInit(): void {
    this.loadGoals();
  }

  // Load goals from localStorage
  private loadGoals(): void {
    const stored = localStorage.getItem('goals');
    if (stored) {
      this.goals = JSON.parse(stored);
    }
  }

  // Save goals to localStorage
  private saveGoals(): void {
    localStorage.setItem('goals', JSON.stringify(this.goals));
  }

  onCompletionChanged(): void {
  // Optional: reload goals to update any completion-related UI (e.g., streak counters)
  // Since completions are stored separately, you might want to refresh the goal list.
  // For now, just log or do nothing.
  console.log('Completions updated');
}

  // Create or update goal
  handleGoal(goal: IGoalFormData): void {
    if (this.editingGoal) {
      // Update existing goal
      const index = this.goals.findIndex(g => g.id === this.editingGoal!.id);
      if (index !== -1) {
        this.goals[index] = { ...goal, id: this.editingGoal.id }; // preserve id
        this.editingGoal = null;
      }
    } else {
      // Create new goal – assign a unique id
      const newGoal = { ...goal, id: Date.now().toString() };
      this.goals.push(newGoal);
    }
    this.saveGoals();
    this.showCreateGoal = false;
  }


  createGoal(): void {
    this.editingGoal = null;
    this.showCreateGoal = true;
  }

  closeCreateGoal(): void {
    this.showCreateGoal = false;
    this.editingGoal = null;
  }

  // Open form to edit an existing goal
  editGoal(goal: IGoalFormData): void {
    this.editingGoal = goal;
    this.showCreateGoal = true;
  }

  // Delete a goal
  deleteGoal(goalId: string): void {
    this.goals = this.goals.filter(g => g.id !== goalId);
    this.saveGoals();
  }


  // handleGoal(goal: IGoalFormData) {
  //   this.goals.push(goal);
  //   console.log("Create Goal button clicked", this.goals[0]);
  //   this.showCreateGoal = false;
  // }


  showAll() {
    this.viewMode = 'all';
    console.log("All button clicked");
    // this.router.navigate(['/allGoals']);
  }

  showDaily() {
    this.viewMode = 'daily';
    console.log("Daily button clicked");
    // this.router.navigate(['/dailyGoals']);
  }

  showWeekly() {
    this.viewMode = 'weekly';
    console.log("Weekly button clicked");
    // this.router.navigate(['/weeklyGoals']);
  }
}
