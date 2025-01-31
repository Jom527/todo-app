// todos/dto/todo.dto.ts
import {
  IsString,
  IsOptional,
  IsEnum,
  MaxLength,
  IsNumber,
} from "class-validator";
import { Priority } from "../enums/priority";
import { Status } from "../enums/status";

export class CreateTodoDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority = Priority.HIGH;

  @IsOptional()
  @IsEnum(Status)
  status?: Status = Status.TODO;
}

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}

export class DeleteTodoDto {
  @IsNumber()
  id: number;
}

export class TodoDto {
  id: number;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}
