
import { render, screen, fireEvent } from '@testing-library/angular';
import { createSpyFromClass } from 'jest-auto-spies'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { TodoListTableComponent } from './todo-list-table.component';
import { AppComponentStore } from '../app.component.store';
import { status } from '../utils/constants/app.constant';
import { createToDoMock } from '../utils/mocks/todo.mock';
import { Todos } from '../utils/models/todo.model';
describe('ToDo List component Testing', () => {
  async function setup({ todoData = [createToDoMock()] }: { todoData ?: Todos[]} = {} ){

    const mockComponentStore = createSpyFromClass(AppComponentStore, { 
      observablePropsToSpyOn: ["vm$"],
      gettersToSpyOn:["todoForm", "editForm"],
      methodsToSpyOn:[ "deleteToDoTrigger", "completeTaskTrigger", "editTaskTrigger"]
    })

    mockComponentStore.accessorSpies.getters.todoForm.mockReturnValue(
      new FormGroup({
       todo : new FormControl('',  [Validators.required])
      })
    )

    mockComponentStore.accessorSpies.getters.editForm.mockReturnValue(
      new FormGroup({
        taskName : new FormControl(''),
        taskStatus : new FormControl(status.TODO),
      })
    )

    mockComponentStore.vm$.nextWith({
      todoList : todoData,
      showModal: false,
      showToast: false,
      toastHeader: '',
      toastBody : '',
    })

    const {fixture} = await render(TodoListTableComponent, {
      imports: [TodoListTableComponent],
      componentProviders: [
        {
          provide:AppComponentStore,
          useValue: mockComponentStore
        }
      ]
    });
    return {
      fixture,
      mockComponentStore
    }
  }

  it('Should display the table in the page', async() => {
     await setup();
     const rows = screen.getAllByRole('row');
     const headerRow = rows[0]; 
     const dataRows = rows.slice(1)
     expect(headerRow).toHaveTextContent('#ItemStatusAction');
     expect(dataRows).toHaveLength(1);
  })

  it('should display the edit and delete and completed button for todo task', async() => {
    await setup();
    expect(screen.getByRole('button', {name : 'Edit'})).toBeVisible();
    expect(screen.getByRole('button', {name : 'Completed'})).toBeVisible();
    expect(screen.getByRole('button', {name : 'Delete'})).toBeVisible();
  })

  it('should call editTaskTrigger when edit button is clicked', async() => {
    const {mockComponentStore} = await setup()
    const editButton = screen.getByRole('button', {name : 'Edit'});
    fireEvent.click(editButton);
    expect(mockComponentStore.editTaskTrigger).toHaveBeenCalledWith(0)
  })

  it('should call deleteTaskTrigger when edit button is clicked', async() => {
    const {mockComponentStore} = await setup()
    const deleteButton = screen.getByRole('button', {name : 'Delete'});
    fireEvent.click(deleteButton);
    expect(mockComponentStore.deleteToDoTrigger).toHaveBeenCalledWith(0)
  })


  it('should call completeTaskTrigger when edit button is clicked', async() => {
    const {mockComponentStore} = await setup()
    const completedButton = screen.getByRole('button', {name : 'Completed'});
    fireEvent.click(completedButton);
    expect(mockComponentStore.completeTaskTrigger).toHaveBeenCalledWith(0)
  })

})