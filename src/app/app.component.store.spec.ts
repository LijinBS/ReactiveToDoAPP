import { fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { AppComponentStore } from './app.component.store';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { status } from './utils/constants/app.constant';

describe('App component store', () => {
  function setup() {
    const componentStore = new AppComponentStore();
    const todoFormControl = componentStore.todoForm.controls['todo'];
    const taskNameControl = componentStore.editForm.controls['taskName'];
    const taskStatusControl = componentStore.editForm.controls['taskStatus'];

    return {
      componentStore,
      todoFormControl,
      taskNameControl,
      taskStatusControl,
    };
  }

  describe('Effect spec', () => {
    it('Will call the addToDo trigger when add task form was set', fakeAsync(() => {
      const { componentStore, todoFormControl } = setup();
      todoFormControl.setValue('task1');
      componentStore.addToDoTrigger();
      flushMicrotasks();
      const vmSpy = subscribeSpyTo(componentStore.vm$);
      flushMicrotasks();
      expect(vmSpy.getLastValue()?.todoList).toStrictEqual([
        { item: 'task1', status: 'To Do' },
      ]);
    }));

    it('When deleteToDoTrigger is called and data will be deleted in the vm ', fakeAsync(() => {
      const { componentStore, todoFormControl } = setup();
      todoFormControl.setValue('task1');
      componentStore.addToDoTrigger();
      flushMicrotasks();
      componentStore.deleteToDoTrigger(0);
      flushMicrotasks();
      const vmSpy = subscribeSpyTo(componentStore.vm$);
      flushMicrotasks();
      expect(vmSpy.getLastValue()?.todoList).toStrictEqual([]);
    }));

    it('When deleteToDoTrigger is called and data will be deleted in the vm ', fakeAsync(() => {
      const { componentStore, todoFormControl } = setup();
      todoFormControl.setValue('task1');
      componentStore.addToDoTrigger();
      flushMicrotasks();
      componentStore.completeTaskTrigger(0);
      flushMicrotasks();
      const vmSpy = subscribeSpyTo(componentStore.vm$);
      flushMicrotasks();
      expect(vmSpy.getLastValue()?.todoList).toStrictEqual([
        { item: 'task1', status: 'Done' },
      ]);
    }));

    it('When updateTaskTrigger is called and will update new data in the vm', fakeAsync(() => {
      const {
        componentStore,
        todoFormControl,
        taskNameControl,
        taskStatusControl,
      } = setup();
      todoFormControl.setValue('task1');
      componentStore.addToDoTrigger();
      flushMicrotasks();
      componentStore.editTaskTrigger(0);
      flushMicrotasks();
      taskNameControl.setValue('Task2');
      taskStatusControl.setValue(status.INPROGRESS);
      componentStore.updateTaskTrigger();
      flushMicrotasks();
      const vmSpy = subscribeSpyTo(componentStore.vm$);
      flushMicrotasks();
      expect(vmSpy.getLastValue()?.todoList).toStrictEqual([
        { item: 'Task2', status: 'In progress' },
      ]);
    }));

    it('When editTaskTrigger is called will update showmodal value in the vm', fakeAsync(() => {
      const { componentStore, todoFormControl } = setup();
      todoFormControl.setValue('task1');
      componentStore.addToDoTrigger();
      flushMicrotasks();
      componentStore.editTaskTrigger(0);
      flushMicrotasks();
      const vmSpy = subscribeSpyTo(componentStore.vm$);
      flushMicrotasks();
      expect(vmSpy.getLastValue()?.showModal).toStrictEqual(true);
    }));

    it('When closeModal is called will update showmodal value in the vm', fakeAsync(() => {
      const { componentStore, todoFormControl } = setup();
      todoFormControl.setValue('task1');
      componentStore.addToDoTrigger();
      flushMicrotasks();
      componentStore.editTaskTrigger(0);
      flushMicrotasks();
      componentStore.closeModal();
      flushMicrotasks();
      const vmSpy = subscribeSpyTo(componentStore.vm$);
      flushMicrotasks();
      expect(vmSpy.getLastValue()?.showModal).toStrictEqual(false);
    }));
  });
});
