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
import { CreateTodoDto, UpdateTodoDto } from "./dto";
import { Priority } from "./enums/priority";
import { Todo } from "./todos.entity";
import { TodosService } from "./todos.service";

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

  @Delete(":id")
  async remove(@Param("id") id: number): Promise<void> {
    return this.todosService.remove(id);
  }
}
