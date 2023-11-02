import { AppComponent } from "./app.component"
import { render, screen, fireEvent } from '@testing-library/angular';
import { AppModule } from "./app.module";
import { AppComponentStore } from "./app.component.store";
import { createSpyFromClass } from 'jest-auto-spies'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { status } from "./utils/constants/app.constant";

describe('AppCompoent Testing', () => {
   async function setup({ showToast = false}: { showToast ?: boolean} = {} ){

    const mockComponentStore = createSpyFromClass(AppComponentStore, { 
      observablePropsToSpyOn: ["vm$"],
      gettersToSpyOn:["todoForm", "editForm"],
      methodsToSpyOn:["addToDoTrigger", "closeModal"]
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
      todoList : [],
      showModal: false,
      showToast: showToast,
      toastHeader: '',
      toastBody : '',
    })

    const {fixture} = await render(AppComponent, {
      imports: [AppModule],
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
  it('Should display the title in the page', async() => {
    await setup()
    expect(screen.getByText('To Do App')).toBeVisible();
  })

  it('Should display the text box in the page', async() => {
    await setup()
    screen.logTestingPlaygroundURL();
    expect(screen.getByRole('textbox')).toBeVisible();
  })

  it('Should display the save button in the page', async() => {
    await setup()
    expect(screen.getByText('Save')).toBeVisible();
  })

  it('Should save button be disabled when the text box is empty', async() => {
    await setup();
    expect(screen.getByText('Save')).toHaveClass('disabled');
  })

  it('Should save button be enabled when the text box is not empty', async() => {
    const { mockComponentStore } = await setup();
    const inputElement = screen.getByRole('textbox');
    fireEvent.input(inputElement, { target: { value: 'New Task' } })
    expect(inputElement).toHaveValue('New Task');
    expect(screen.getByText('Save')).not.toHaveClass('disabled');
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    expect(mockComponentStore.addToDoTrigger).toHaveBeenCalled()
  })

})
