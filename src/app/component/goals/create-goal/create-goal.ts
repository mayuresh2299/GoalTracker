import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-goal',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './create-goal.html',
  styleUrl: './create-goal.css',
})
export class CreateGoal {  
  title: string = '';
  type: string = '';
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  submitForm() {
    const goal = {
      title: this.title,
      type: this.type,
      // whatever fields
    };

    this.save.emit(goal);
    this.close.emit();
  }
}