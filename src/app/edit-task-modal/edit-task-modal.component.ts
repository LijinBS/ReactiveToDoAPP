import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { status } from '../utils/constants/app.constant';
import { AppComponentStore } from '../app.component.store';

@Component({
  selector: 'app-edit-task-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-task-modal.component.html',
  styleUrls: ['./edit-task-modal.component.scss'],
})
export class EditTaskModalComponent {
  readonly editForm = this.appStore.editForm;
  readonly STATUS = status;
  readonly vm$ = this.appStore.vm$;

  updateTask() {
    this.appStore.updateTaskTrigger();
  }

  closeModal() {
    this.appStore.closeModal();
  }
  constructor(private appStore: AppComponentStore) {}
}
