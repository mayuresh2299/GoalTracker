import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IGoalFormData } from '../goal-form-data/goal-form-data';
// import { IGoalFormData } from '../goal-form/goal-form.component';

interface CompletionRecord {
  [goalId: string]: string[]; // array of ISO date strings (YYYY-MM-DD)
}

@Component({
  selector: 'app-goal-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './goal-calendar.html',
  styleUrl: './goal-calendar.css',
})
export class GoalCalendarComponent implements OnInit, OnChanges {
  @Input() goal!: IGoalFormData;
  @Output() close = new EventEmitter<void>();
  @Output() completionChanged = new EventEmitter<void>(); // notify parent to refresh if needed

  // Calendar data
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth(); // 0-based
  weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  calendarDays: { date: Date; isCurrentMonth: boolean; completed: boolean }[] = [];
  
  completions: CompletionRecord = {};
  
  get currentMonthName(): string {
    return new Date(this.currentYear, this.currentMonth).toLocaleString('default', { month: 'long' });
  }
  
  get completedCount(): number {
    return this.calendarDays.filter(d => d.completed && d.isCurrentMonth).length;
  }
  
  get totalTrackedDays(): number {
    const goalCompletions = this.completions[this.goal.id!] || [];
    return goalCompletions.length;
  }

  ngOnInit(): void {
    this.loadCompletions();
    this.generateCalendar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['goal'] && !changes['goal'].firstChange) {
      this.loadCompletions();
      this.generateCalendar();
    }
  }

  private loadCompletions(): void {
    const stored = localStorage.getItem('goal_completions');
    if (stored) {
      this.completions = JSON.parse(stored);
    } else {
      this.completions = {};
    }
  }

  private saveCompletions(): void {
    localStorage.setItem('goal_completions', JSON.stringify(this.completions));
    this.completionChanged.emit();
  }

  private generateCalendar(): void {
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const startDay = firstDayOfMonth.getDay(); // 0 = Sunday
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    
    // Previous month days
    const prevMonthDays = [];
    const prevMonthDate = new Date(this.currentYear, this.currentMonth, 0);
    const daysInPrevMonth = prevMonthDate.getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(this.currentYear, this.currentMonth - 1, daysInPrevMonth - i);
      prevMonthDays.push({ date, isCurrentMonth: false, completed: false });
    }
    
    // Current month days
    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(this.currentYear, this.currentMonth, i);
      const dateStr = this.toISODate(date);
      const completed = this.completions[this.goal.id!]?.includes(dateStr) ?? false;
      currentMonthDays.push({ date, isCurrentMonth: true, completed });
    }
    
    // Next month days (fill to 42 cells)
    const remainingCells = 42 - (prevMonthDays.length + currentMonthDays.length);
    const nextMonthDays = [];
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(this.currentYear, this.currentMonth + 1, i);
      nextMonthDays.push({ date, isCurrentMonth: false, completed: false });
    }
    
    this.calendarDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  }

  toggleDay(day: { date: Date; isCurrentMonth: boolean }): void {
    if (!day.isCurrentMonth) return;
    const dateStr = this.toISODate(day.date);
    let goalCompletions = this.completions[this.goal.id!] || [];
    if (goalCompletions.includes(dateStr)) {
      // Remove
      goalCompletions = goalCompletions.filter(d => d !== dateStr);
    } else {
      // Add
      goalCompletions.push(dateStr);
    }
    this.completions[this.goal.id!] = goalCompletions;
    this.saveCompletions();
    this.generateCalendar(); // refresh UI
  }

  resetAllForGoal(): void {
    if (confirm(`Delete all completion records for "${this.goal.title}"?`)) {
      delete this.completions[this.goal.id!];
      this.saveCompletions();
      this.generateCalendar();
    }
  }

  prevMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  private toISODate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}