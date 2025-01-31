// todos/todos.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Todo } from "./todos.entity";
import { CreateTodoDto, UpdateTodoDto } from "./dto";
import { Priority } from "./enums/priority";

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const newTodo = this.todosRepository.create(createTodoDto);
    return this.todosRepository.save(newTodo);
  }

  async findAll(): Promise<Todo[]> {
    return this.todosRepository.find();
  }

  async findOne(id: number): Promise<Todo> {
    const todo = await this.todosRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

    async getFilteredTodos(priority: Priority): Promise<Todo[]> {
      const todos = await this.todosRepository.find({
        where: { priority },
        order: { createdAt: 'ASC' },
      });
      return todos;
    }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id);
    await this.todosRepository.update(todo.id, updateTodoDto);
    return this.findOne(todo.id);
  }

  async remove(id: number): Promise<void> {
    const todo = await this.findOne(id);
    await this.todosRepository.remove(todo);
  }
}
