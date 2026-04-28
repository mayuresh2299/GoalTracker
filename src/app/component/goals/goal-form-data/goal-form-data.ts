// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-goal-form-data',
//   imports: [],
//   templateUrl: './goal-form-data.html',
//   styleUrl: './goal-form-data.css',
// })
// export class GoalFormData {}

import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface IGoalFormData {
  id?: string;               // for editing/deleting
  title: string;
  goalType: 'yesNo' | 'withValue';
  targetValue?: number;
  startDateTime: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  // Daily config
  everyNDays?: number;
  // Weekly config
  everyNWeeks?: number;
  selectedWeekdays?: number[]; // 0=Sunday ... 6=Saturday
  // Monthly config
  everyNMonths?: number;
  dayOfMonth?: number;
  // Yearly config
  everyNYears?: number;
  yearlyMonth?: number; // 1-12
  yearlyDay?: number;
  // Reminders
  remindersEnabled: boolean;
  reminderOffset: string;
}

@Component({
  selector: 'app-goal-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './goal-form-data.html',
})
export class GoalFormData implements OnInit {
  @Input() editMode = false;
  // In the child component
  @Input() goalData: IGoalFormData | null | undefined;
  // @Input() goalData?: IGoalFormData; // data to edit
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<IGoalFormData>();

  // Goal Name
  title: string = '';

  // Yes/No or Goal with value
  goalValueType: 'yesNo' | 'withValue' = 'yesNo';
  targetValue?: number = 100;

  // Start date-time with time selection (default now)
  startDateTime: string = '';

  // Frequency
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'daily';

  // Daily config
  everyNDays: number = 1;

  // Weekly config
  everyNWeeks: number = 1;
  weekDaysList: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  weekdaysSelected: boolean[] = [false, true, false, false, false, false, false]; // Monday default

  // Monthly config
  everyNMonths: number = 1;
  dayOfMonth: number = 1;

  // Yearly config
  everyNYears: number = 1;
  yearlyMonth: number = 1; // January
  yearlyDay: number = 1;

  // Months for yearly selector
  months = [
    { value: 1, name: 'January' }, 
    { value: 2, name: 'February' }, 
    { value: 3, name: 'March' },
    { value: 4, name: 'April' }, 
    { value: 5, name: 'May' }, 
    { value: 6, name: 'June' },
    { value: 7, name: 'July' }, 
    { value: 8, name: 'August' }, 
    { value: 9, name: 'September' },
    { value: 10, name: 'October' }, 
    { value: 11, name: 'November' }, 
    { value: 12, name: 'December' }
  ];

  // Reminders
  remindersEnabled: boolean = false;
  reminderOffset: string = '5min';

  get anyWeekdaySelected(): boolean {
    return this.weekdaysSelected.some(selected => selected);
  }

  ngOnInit(): void {
    // Pre-fill if editing
    if (this.editMode && this.goalData) {
      this.title = this.goalData.title;
      this.goalValueType = this.goalData.goalType;
      this.targetValue = this.goalData.targetValue;
      this.startDateTime = this.goalData.startDateTime;
      this.frequency = this.goalData.frequency;
      this.everyNDays = this.goalData.everyNDays ?? 1;
      this.everyNWeeks = this.goalData.everyNWeeks ?? 1;
      // this.weekdaysSelected = this.initWeekdaysFromData(this.goalData.selectedWeekdays());
      this.everyNMonths = this.goalData.everyNMonths ?? 1;
      this.dayOfMonth = this.goalData.dayOfMonth ?? 1;
      this.everyNYears = this.goalData.everyNYears ?? 1;
      this.yearlyMonth = this.goalData.yearlyMonth ?? 1;
      this.yearlyDay = this.goalData.yearlyDay ?? 1;
      this.remindersEnabled = this.goalData.remindersEnabled ?? false;
      this.reminderOffset = this.goalData.reminderOffset ?? '5min';
    } else {
      // Set default current date and time with time selection (datetime-local format)
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      this.startDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
  }

   private initWeekdaysFromData(selected?: number[]): boolean[] {
    const weekdays = new Array(7).fill(false);
    if (selected) {
      selected.forEach(idx => weekdays[idx] = true);
    }
    return weekdays;
  }

  submitForm(): void {
    // Basic validation
    if (!this.title?.trim()) {
      alert('Please enter a goal name');
      return;
    }

    if (this.frequency === 'weekly' && !this.anyWeekdaySelected) {
      alert('Please select at least one weekday for weekly goal');
      return;
    }

    // Build data payload
    const formData: IGoalFormData = {
      title: this.title.trim(),
      goalType: this.goalValueType,
      startDateTime: this.startDateTime,
      frequency: this.frequency,
      remindersEnabled: this.remindersEnabled,
      reminderOffset: this.reminderOffset,
      // include optional fields
      targetValue: this.targetValue,
      everyNDays: this.everyNDays,
      everyNWeeks: this.everyNWeeks,
      selectedWeekdays: this.getSelectedWeekdays(),
      everyNMonths: this.everyNMonths,
      dayOfMonth: this.dayOfMonth,
      everyNYears: this.everyNYears,
      yearlyMonth: this.yearlyMonth,
      yearlyDay: this.yearlyDay
    };

    if (this.goalValueType === 'withValue') {
      formData.targetValue = this.targetValue;
    }

    switch (this.frequency) {
      case 'daily':
        formData.everyNDays = this.everyNDays;
        break;
      case 'weekly':
        formData.everyNWeeks = this.everyNWeeks;
        formData.selectedWeekdays = this.weekdaysSelected
          .map((selected, idx) => selected ? idx : -1)
          .filter(idx => idx !== -1);
        break;
      case 'monthly':
        formData.everyNMonths = this.everyNMonths;
        formData.dayOfMonth = this.dayOfMonth;
        break;
      case 'yearly':
        formData.everyNYears = this.everyNYears;
        formData.yearlyMonth = this.yearlyMonth;
        formData.yearlyDay = this.yearlyDay;
        break;
    }

    this.save.emit(formData);
  }

  private getSelectedWeekdays(): number[] {
    return this.weekdaysSelected
      .map((selected, idx) => selected ? idx : -1)
      .filter(idx => idx !== -1);
  }
}