import { Todo } from "../todos.entity";

type OmittedTodo = Omit<Todo, "setStatus">;

export interface GetCompletedTaskResponse extends OmittedTodo {
  effortBurn: number;
}
