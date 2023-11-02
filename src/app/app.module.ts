import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { TodoListTableComponent } from './todo-list-table/todo-list-table.component';
import { EditTaskModalComponent } from './edit-task-modal/edit-task-modal.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    TodoListTableComponent,
    EditTaskModalComponent,
    FormsModule,
    ReactiveFormsModule,
    NgbToastModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
