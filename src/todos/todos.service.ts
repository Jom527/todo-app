// todos/todos.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  isEmpty,
  isScheduled,
  isZeroOrNull,
  effortBurnComputation,
} from "@todo-app/utilities";
import { Repository } from "typeorm";
import {
  CreateTodoDto,
  UpdateTodoDto,
  UpdateTaskDto,
  UpdateTaskModal,
  UpdateTaskModalDto,
} from "./dto";
import { Priority, Status, TaskType } from "./enums";
import {
  UpdatePriorityResponse,
  UpdateStatusResponse,
  UpdateTaskTypeResponse,
  GetCompletedTaskResponse,
} from "@todo-app/interfaces";
import { Todo } from "./todos.entity";

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const insertTask = new Todo();
    insertTask.title = createTodoDto.title;
    insertTask.description = createTodoDto.description;
    insertTask.priority = createTodoDto.priority;
    insertTask.status = createTodoDto.status;
    insertTask.isScheduled = isScheduled(createTodoDto.category);
    const newTodo = this.todosRepository.create(insertTask);
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

  async getAllTask(): Promise<Todo[]> {
    const tasks = await this.todosRepository.find({
      order: { priority: "ASC", createdAt: "ASC" },
    });
    return tasks;
  }

  async getFilteredTodos(priority: Priority): Promise<Todo[]> {
    const todos = await this.todosRepository.find({
      where: { priority },
      order: { createdAt: "ASC" },
    });
    return todos;
  }

  async getAllCompletedTask(): Promise<GetCompletedTaskResponse[]> {
    const tasks = await this.todosRepository.find({
      where: { status: Status.COMPLETED },
      order: { completedAt: "ASC" },
    });
    const filteredTask = tasks.map((item) => ({
      ...item,
      effortBurn: effortBurnComputation(item.createdAt, item.completedAt),
    }));

    return filteredTask;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id);
    await this.todosRepository.update(todo.id, updateTodoDto);
    return this.findOne(todo.id);
  }

  async updateModalTask(updateTaskDto: UpdateTaskModalDto): Promise<Todo> {
    if (
      isEmpty(updateTaskDto.category) ||
      !Object.values(TaskType).includes(updateTaskDto.category)
    ) {
      throw new BadRequestException("Type is required or invalid");
    }
    const task = await this.findOne(updateTaskDto.id);
    const updateTask = new UpdateTaskModal();
    updateTask.title = updateTaskDto.title;
    updateTask.description = updateTaskDto.description;
    updateTask.isScheduled = isScheduled(updateTaskDto.category);
    await this.todosRepository.update(task.id, updateTask);
    return this.findOne(task.id);
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
    const response = {} as UpdateStatusResponse;
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
    const response = {} as UpdatePriorityResponse;
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
    const response = {} as UpdateTaskTypeResponse;
    response.id = data.id;
    response.isScheduled = data.isScheduled;
    return response;
  }

  async remove(id: number): Promise<void> {
    const todo = await this.findOne(id);
    await this.todosRepository.remove(todo);
  }
}
