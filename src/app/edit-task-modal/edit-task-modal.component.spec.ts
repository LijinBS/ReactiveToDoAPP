import { createSpyFromClass } from "jest-auto-spies"
import { createToDoMock } from "../utils/mocks/todo.mock"
import { Todos } from "../utils/models/todo.model"
import { AppComponentStore } from "../app.component.store"
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { fireEvent, render, screen } from "@testing-library/angular"
import { EditTaskModalComponent } from "./edit-task-modal.component"
import { status } from "../utils/constants/app.constant"

describe('Edit task component Testing', () => {
  async function setup({ todoData = [createToDoMock()] }: { todoData ?: Todos[]} = {} ){

    const mockComponentStore = createSpyFromClass(AppComponentStore, { 
      observablePropsToSpyOn: ["vm$"],
      gettersToSpyOn:["todoForm", "editForm"],
      methodsToSpyOn:[ "closeModal", "updateTaskTrigger"]
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
      showModal: true,
      showToast: false,
      toastHeader: '',
      toastBody : '',
    })

    const {fixture} = await render(EditTaskModalComponent, {
      imports: [EditTaskModalComponent],
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

  it('Should display the task name and task input box', async() => {
    await setup();
    screen.logTestingPlaygroundURL();
    expect(screen.getByRole('textbox', {
      name: /task name:/i,
      hidden: true
    })).toBeVisible()
  })

  it('should display the select box in the page', async() => {
    await setup();
    expect(screen.getByRole('combobox', {
      name: /task status:/i,
      hidden: true
    })).toBeVisible();
  })

  it('should display the footer buttons in the page', async() => {
    await setup();
    expect(screen.getByText(/close/i)).toBeVisible();
    expect(screen.getByRole('button', {
      name: /update/i,
      hidden: true
    })).toBeVisible();
  })

  it('should trigger updateTaskTrigger when click on update button', async() => {
    const {mockComponentStore }  = await setup();
    const updateButton = screen.getByRole('button', {
      name: /update/i,
      hidden: true
    })
    fireEvent.click(updateButton);
    expect(mockComponentStore.updateTaskTrigger).toHaveBeenCalled();
  })

  it('should trigger close Modal when click on  close button', async() => {
    const {mockComponentStore }  = await setup();
    const closeButton = screen.getByText(/close/i);
    fireEvent.click(closeButton);
    expect(mockComponentStore.closeModal).toHaveBeenCalled();

  })
})