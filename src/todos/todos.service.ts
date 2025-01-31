// todos/todos.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Todo } from "./todos.entity";
import { CreateTodoDto, UpdateTodoDto } from "./dto";
import { Priority } from "./enums/priority";
import { Status } from "./enums/status";
import {
  UpdatePriorityResponse,
  UpdateStatusResponse,
  UpdateTaskTypeResponse,
} from "./response/update";
import { isEmpty, isScheduled, isZeroOrNull } from "src/utility/booleanChecker";
import { UpdateTaskDto } from "./dto/update";
import { TaskType } from "./enums/taskType";

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
      order: { createdAt: "ASC" },
    });
    return todos;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id);
    await this.todosRepository.update(todo.id, updateTodoDto);
    return this.findOne(todo.id);
  }

  async updateTaskByStatus(
    id: number,
    status: Status,
  ): Promise<UpdateStatusResponse> {
    if (isZeroOrNull(id)) {
      throw new BadRequestException("ID is required");
    }
    if (isEmpty(status) || !Object.values(Status).includes(status)) {
      throw new BadRequestException("Status is required or invalid");
    }
    const task = await this.findOne(id);
    const completion = task.setStatus(status);
    const updateStatus = new UpdateTaskDto();
    updateStatus.id = id;
    updateStatus.status = status;
    updateStatus.completedAt = completion;
    await this.todosRepository.update(task.id, updateStatus);
    const data = await this.findOne(id);
    const response = new UpdateStatusResponse();
    response.id = data.id;
    response.status = data.status;
    return response;
  }

  async updateTaskByPrioriy(
    id: number,
    priority: Priority,
  ): Promise<UpdatePriorityResponse> {
    if (isZeroOrNull(id)) {
      throw new BadRequestException("ID is required");
    }
    if (isEmpty(priority) || !Object.values(Priority).includes(priority)) {
      throw new BadRequestException("Priority is required or invalid");
    }
    const task = await this.findOne(id);
    const updatePriority = new UpdateTaskDto();
    updatePriority.id = id;
    updatePriority.priority = priority;
    await this.todosRepository.update(task.id, updatePriority);
    const data = await this.findOne(id);
    const response = new UpdatePriorityResponse();
    response.id = data.id;
    response.priority = data.priority;
    return response;
  }

  async updateTaskByType(
    id: number,
    type: TaskType,
  ): Promise<UpdateTaskTypeResponse> {
    if (isZeroOrNull(id)) {
      throw new BadRequestException("ID is required");
    }
    if (isEmpty(type) || !Object.values(TaskType).includes(type)) {
      throw new BadRequestException("Type is required or invalid");
    }
    const task = await this.findOne(id);
    const updateTask = new UpdateTaskDto();
    updateTask.id = id;
    updateTask.isScheduled = isScheduled(type);
    await this.todosRepository.update(task.id, updateTask);
    const data = await this.findOne(id);
    const response = new UpdateTaskTypeResponse();
    response.id = data.id;
    response.isScheduled = data.isScheduled;
    return response;
  }

  async remove(id: number): Promise<void> {
    const todo = await this.findOne(id);
    await this.todosRepository.remove(todo);
  }
}
