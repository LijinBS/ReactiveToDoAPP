import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppComponentStore } from './app.component.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AppComponentStore],
})
export class AppComponent {
  readonly vm$ = this.appStore.vm$;
  readonly todoForm = this.appStore.todoForm;

  saveTodo(): void {
    this.appStore.addToDoTrigger();
  }

  hideToast():void {
    this.appStore.hideToast();
  }
  constructor(private appStore: AppComponentStore) {}
}
