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
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="close.emit()">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-auto" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">{{ goal.title }} – Completion Calendar</h2>
          <button (click)="close.emit()" class="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <!-- Month navigation -->
        <div class="flex justify-between items-center mb-4">
          <button (click)="prevMonth()" class="px-3 py-1 border rounded">◀</button>
          <span class="text-lg font-semibold">{{ currentMonthName }} {{ currentYear }}</span>
          <button (click)="nextMonth()" class="px-3 py-1 border rounded">▶</button>
        </div>

        <!-- Calendar grid -->
        <div class="grid grid-cols-7 gap-1 text-center mb-2">
          <div *ngFor="let day of weekDays" class="font-medium text-gray-600">{{ day }}</div>
        </div>
        <div class="grid grid-cols-7 gap-1">
          <button *ngFor="let day of calendarDays"
                  (click)="toggleDay(day)"
                  [disabled]="!day.isCurrentMonth"
                  class="h-10 rounded-lg flex items-center justify-center transition"
                  [class.bg-green-500]="day.completed && day.isCurrentMonth"
                  [class.text-white]="day.completed && day.isCurrentMonth"
                  [class.bg-gray-100]="!day.completed && day.isCurrentMonth"
                  [class.text-gray-400]="!day.isCurrentMonth"
                  [class.cursor-pointer]="day.isCurrentMonth"
                  [class.opacity-50]="!day.isCurrentMonth">
            {{ day.date.getDate() }}
          </button>
        </div>

        <!-- Legend / Stats -->
        <div class="mt-4 pt-4 border-t text-sm text-gray-600">
          <div class="flex gap-4">
            <span>✅ Completed: {{ completedCount }}</span>
            <span>📅 Total tracked: {{ totalTrackedDays }}</span>
          </div>
          <button (click)="resetAllForGoal()" class="mt-2 text-red-500 hover:underline">Reset all completion data for this goal</button>
        </div>
      </div>
    </div>
  `
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