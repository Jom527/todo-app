import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { CreateTodoDto, UpdateTodoDto, UpdateTaskModalDto } from "./dto";
import { Priority, Status, TaskType } from "./enums";
import { Todo } from "./todos.entity";
import { TodosService } from "./todos.service";
import {
  UpdatePriorityResponse,
  UpdateStatusResponse,
  UpdateTaskTypeResponse,
  GetCompletedTaskResponse,
} from "@todo-app/interfaces";

@Controller("todos")
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todosService.create(createTodoDto);
  }

  @Get()
  async getAllTask(): Promise<Todo[]> {
    return this.todosService.getAllTask();
  }

  @Get()
  async findAll(@Query("priority") priority?: Priority): Promise<Todo[]> {
    if (priority) {
      return this.todosService.getFilteredTodos(priority);
    }
    return this.todosService.findAll();
  }

  @Get("completed")
  async getAllCompletedTasks(
  ): Promise<GetCompletedTaskResponse[]> {
    const task = await this.todosService.getAllCompletedTask();
    return task.length !== 0 ? task : [];
  }

  @Get(":id")
  async findOne(@Param("id") id: number): Promise<Todo> {
    return this.todosService.findOne(id);
  }

  @Put()
  async updateTaskModal(
    @Body() updateTaskModalDto: UpdateTaskModalDto,
  ): Promise<Todo> {
    return this.todosService.updateModalTask(updateTaskModalDto);
  }

  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    return this.todosService.update(id, updateTodoDto);
  }

  @Put(":id/status=:status")
  async updateTaskByStatus(
    @Param("id") id: number,
    @Param("status") status: Status,
  ): Promise<UpdateStatusResponse> {
    return this.todosService.updateTaskByStatus(id, status);
  }

  @Put(":id/priority=:priority")
  async updateTaskByPriority(
    @Param("id") id: number,
    @Param("priority") priority: Priority,
  ): Promise<UpdatePriorityResponse> {
    return this.todosService.updateTaskByPrioriy(id, priority);
  }

  @Put(":id/type=:type")
  async updateTaskByType(
    @Param("id") id: number,
    @Param("type") type: TaskType,
  ): Promise<UpdateTaskTypeResponse> {
    return this.todosService.updateTaskByType(id, type);
  }

  @Delete(":id")
  async remove(@Param("id") id: number): Promise<void> {
    return this.todosService.remove(id);
  }
}
