import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Todos } from './utils/models/todo.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs';
import { status } from './utils/constants/app.constant';
import { concatLatestFrom } from '@ngrx/effects';

interface AppComponentState {
  todoList: Todos[];
  showToast: boolean;
  toastHeader: string;
  toastBody: string;
  showModal: boolean;
  selectedTask: number;
}

@Injectable()
export class AppComponentStore extends ComponentStore<AppComponentState> {
  private readonly todoFormControl = new FormControl('', {
    validators: [Validators.required],
    nonNullable: true,
  });
  private readonly taskNameControl = new FormControl('', {
    validators: [Validators.required],
    nonNullable: true,
  });
  private readonly taskStatusControl = new FormControl(status.TODO, {
    nonNullable: true,
  });
  private readonly todoList$ = this.select((state) => state.todoList);
  private readonly toastHeader$ = this.select((state) => state.toastHeader);
  private readonly toastBody$ = this.select((state) => state.toastBody);
  private readonly showToast$ = this.select((state) => state.showToast);
  private readonly showModal$ = this.select((state) => state.showModal);
  private readonly selectedTask$ = this.select((state) => state.selectedTask);

  /**
   * Updater for add todo task
   * it will append the newly added task to the list
   */
  private addToDo = this.updater(
    (state, todo: Todos): AppComponentState => ({
      ...state,
      todoList: [...state.todoList, todo],
      showToast: true,
      toastHeader: 'Task Added',
      toastBody: ' New Task Added successfully',
    })
  );

  private deleteTask(taskNo: number, todoList: Todos[]) {
    const toDoTasks = todoList;
    toDoTasks.splice(taskNo, 1);
    this.patchState({
      todoList: toDoTasks,
      showToast: true,
      toastHeader: 'Task Delete',
      toastBody: 'Task Delete successfully',
    });
  }

  private completeTask(taskNo: number, todoList: Todos[]) {
    todoList[taskNo].status = status.DONE;
    this.patchState({
      todoList,
      showToast: true,
      toastHeader: 'Task Complete',
      toastBody: 'Task Completed successfully',
    });
  }

  private updateTask(taskNo: number, todoList: Todos[]) {
    const { taskName, taskStatus } = this.editForm.getRawValue();
    todoList[taskNo] = { item: taskName, status: taskStatus };
    this.patchState({
      todoList,
      showModal: false,
      showToast: true,
      toastHeader: 'Task Edit',
      toastBody: 'Task Edited successfully',
    });
  }

  private editTask(taskNo: number, todoList: Todos[]) {
    const selectTaskData = todoList[taskNo];
    this.editForm.setValue({
      taskName: selectTaskData.item,
      taskStatus: selectTaskData.status,
    });
    this.patchState({
      showModal: true,
      selectedTask: taskNo,
    });
  }

  readonly hideToast = this.updater(
    (state): AppComponentState => ({
      ...state,
      showToast: false,
      toastBody: '',
      toastHeader: '',
    })
  );

  readonly todoForm = new FormGroup({
    todo: this.todoFormControl,
  });

  readonly editForm = new FormGroup({
    taskName: this.taskNameControl,
    taskStatus: this.taskStatusControl,
  });

  readonly vm$ = this.select(
    {
      todoList: this.todoList$,
      showToast: this.showToast$,
      toastHeader: this.toastHeader$,
      toastBody: this.toastBody$,
      showModal: this.showModal$,
    },
    { debounce: true }
  );

  /**
   * Effect is indicate to we can trigger the sideEffect on clik of save action
   * After the updating the add, we can return to update api as well
   * ToDo: Intergration of API call for update todo task in the backend
   */
  readonly addToDoTrigger = this.effect((trigger$) =>
    trigger$.pipe(
      tap(() => {
        const { todo } = this.todoForm.getRawValue();
        this.addToDo({ item: todo, status: status.TODO });
        this.todoForm.reset();
      })
    )
  );

  readonly deleteToDoTrigger = this.effect<number>((taskNo$) =>
    taskNo$.pipe(
      concatLatestFrom(() => this.todoList$),
      tap(([taskNo, todoList]) => {
        this.deleteTask(taskNo, todoList);
      })
    )
  );

  readonly completeTaskTrigger = this.effect<number>((taskNo$) =>
    taskNo$.pipe(
      concatLatestFrom(() => this.todoList$),
      tap(([taskNo, todoList]) => {
        this.completeTask(taskNo, todoList);
      })
    )
  );

  readonly editTaskTrigger = this.effect<number>((taskNo$) =>
    taskNo$.pipe(
      concatLatestFrom(() => this.todoList$),
      tap(([taskNo, todoList]) => {
        this.editTask(taskNo, todoList);
      })
    )
  );

  readonly updateTaskTrigger = this.effect((trigger$) =>
    trigger$.pipe(
      concatLatestFrom(() => [this.selectedTask$, this.todoList$]),
      tap(([, taskNo, todoList]) => {
        this.updateTask(taskNo, todoList);
        this.editForm.reset();
      })
    )
  );

  readonly closeModal = this.effect((trigger$) =>
    trigger$.pipe(
      tap(() => {
        this.patchState({
          showModal: false,
        });
      })
    )
  );

  constructor() {
    super({
      todoList: [],
      showToast: false,
      toastHeader: '',
      toastBody: '',
      showModal: false,
      selectedTask: 0,
    });
  }
}
