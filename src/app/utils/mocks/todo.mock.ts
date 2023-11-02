import { status } from "../constants/app.constant";
import { Todos } from "../models/todo.model";

export function createToDoMock(partial?: Partial<Todos>): Todos {
    return {
        item: 'Test1',
        status: status.TODO,
        ...partial
    }
}