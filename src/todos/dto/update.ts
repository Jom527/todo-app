import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { Status } from "../enums/status";
import { Priority } from "../enums/priority";

class BaseDto {
  @IsNumber()
  id: number;
}
export class UpdateTaskDto extends BaseDto {
  @IsOptional()
  @IsEnum(Status)
  status: Status;
  @IsOptional()
  @IsEnum(Status)
  priority: Priority;
  @IsOptional()
  @IsBoolean()
  isScheduled: boolean;
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
