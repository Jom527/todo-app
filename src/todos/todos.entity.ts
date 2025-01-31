// todos/todos.entity.ts
import { IsEnum, IsOptional, IsString } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Priority } from "./enums/priority";
import { Status } from "./enums/status";

@Entity("users_tasks")
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  title: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Column({
    type: "enum",
    enum: Priority,
    default: Priority.MEDIUM, // Default priority
  })
  @IsEnum(Priority)
  priority: Priority;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.TODO, // Default status
  })
  @IsEnum(Status)
  status: Status;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
