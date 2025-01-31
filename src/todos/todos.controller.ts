import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { CreateTodoDto } from "./dto";
import { Priority } from "./enums/priority";
import { Todo } from "./todos.entity";
import { TodosService } from "./todos.service";
import { Status } from "./enums/status";
import {
  UpdatePriorityResponse,
  UpdateStatusResponse,
  UpdateTaskTypeResponse,
} from "./response/update";
import { UpdateTodoDto } from "./dto/update";
import { TaskType } from "./enums/taskType";

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

  @Get(":id")
  async findOne(@Param("id") id: number): Promise<Todo> {
    return this.todosService.findOne(id);
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
