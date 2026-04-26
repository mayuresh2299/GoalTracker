// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-all-goals',
//   imports: [],
//   templateUrl: './all-goals.html',
//   styleUrl: './all-goals.css',
// })
// export class AllGoals {}


import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoalFormData, IGoalFormData } from '../goal-form-data/goal-form-data';
// import { GoalFormData } from '../goal-form/goal-form.component';

@Component({
  selector: 'app-all-goals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-goals.html',
  // template: `
  //   <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  //     @for (goal of goals; track goal.title) {
  //       <div class="border rounded-lg shadow p-4 bg-white">
  //         <h3 class="text-lg font-bold">{{ goal.title }}</h3>
  //         <p class="text-sm text-gray-600 mt-1">
  //           <span class="font-medium">Type:</span> 
  //           {{ goal.goalType === 'yesNo' ? 'Yes/No Goal' : 'Goal with value' }}
  //           @if (goal.goalType === 'withValue' && goal.targetValue) {
  //             <span> – Target: {{ goal.targetValue }}</span>
  //           }
  //         </p>
  //         <p class="text-sm text-gray-600">
  //           <span class="font-medium">Starts:</span> {{ goal.startDateTime | date:'medium' }}
  //         </p>
  //         <p class="text-sm text-gray-600">
  //           <span class="font-medium">Frequency:</span> {{ goal.frequency | titlecase }}
  //           @switch (goal.frequency) {
  //             @case ('daily') { every {{ goal.everyNDays }} day(s) }
  //             @case ('weekly') { 
  //               every {{ goal.everyNWeeks }} week(s) on 
  //               {{ getWeekdayNames(goal.selectedWeekdays) }}
  //             }
  //             @case ('monthly') { every {{ goal.everyNMonths }} month(s) on day {{ goal.dayOfMonth }} }
  //             @case ('yearly') { every {{ goal.everyNYears }} year(s) in {{ getMonthName(goal.yearlyMonth) }} on day {{ goal.yearlyDay }} }
  //           }
  //         </p>
  //         @if (goal.remindersEnabled) {
  //           <p class="text-sm text-gray-600">
  //             <span class="font-medium">Reminder:</span> {{ goal.reminderOffset }}
  //           </p>
  //         }
  //       </div>
  //     } @empty {
  //       <p class="col-span-full text-center text-gray-500">No goals yet. Create one!</p>
  //     }
  //   </div>
  // `
})
export class AllGoals {
  @Input() goals: IGoalFormData[] = [];
  @Output() edit = new EventEmitter<IGoalFormData>();
  @Output() delete = new EventEmitter<string>();

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