import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IGoalFormData } from '../goal-form-data/goal-form-data';
// import { IGoalFormData } from './goal-form/goal-form.component';

@Component({
  selector: 'app-goal-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './goal-list.html',
  styleUrl: './goal-list.css'
})
export class GoalListComponent {
  @Input() goals: IGoalFormData[] = [];
  @Input() frequencyFilter: 'all' | 'daily' | 'weekly' | 'monthly' | 'yearly' = 'all';
  @Input() emptyMessage = 'No goals yet. Create one!';
  @Output() edit = new EventEmitter<IGoalFormData>();
  @Output() delete = new EventEmitter<string>();
  @Output() openCalendar = new EventEmitter<IGoalFormData>();

  get filteredGoals(): IGoalFormData[] {
    if (this.frequencyFilter === 'all') return this.goals;
    return this.goals.filter(goal => goal.frequency === this.frequencyFilter);
  }

  getWeekdayNames(selectedIndices?: number[]): string {
    if (!selectedIndices || selectedIndices.length === 0) return 'None';
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return selectedIndices.map(i => weekdays[i]).join(', ');
  }

  getMonthName(monthNumber?: number): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNumber ? months[monthNumber - 1] : '';
  }
}