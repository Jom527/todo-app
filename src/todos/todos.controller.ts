import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { CreateTodoDto, UpdateTodoDto } from "./dto";
import { Priority } from "./enums/priority";
import { Todo } from "./todos.entity";
import { TodosService } from "./todos.service";
import { Status } from "./enums/status";
import {
  UpdatePriorityResponse,
  UpdateStatusResponse,
  UpdateTaskTypeResponse,
} from "./response/update";
import { TaskType } from "./enums/taskType";
import { GetCompletedTaskResponse } from "./response/get";
import { UpdateTaskModalDto } from "./dto/update";

@Controller("todos")
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todosService.create(createTodoDto);
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
    @Query("type") type: TaskType,
  ): Promise<GetCompletedTaskResponse[]> {
    const task = await this.todosService.getAllCompletedTask(type);
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
