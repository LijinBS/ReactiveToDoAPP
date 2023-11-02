import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponentStore } from '../app.component.store';
import { status } from '../utils/constants/app.constant';

@Component({
  selector: 'app-todo-list-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-list-table.component.html',
  styleUrls: ['./todo-list-table.component.scss']
})
export class TodoListTableComponent {
  readonly vm$ = this.appStore.vm$;
  readonly STATUS = status

  deleteTask(taskId: number): void {
      this.appStore.deleteToDoTrigger(taskId);
  }

  completeTask(taskId: number):void{
    this.appStore.completeTaskTrigger(taskId)
  }
  editTask(taskId: number): void{
    this.appStore.editTaskTrigger(taskId)
  }
  constructor(private appStore: AppComponentStore){}
}
