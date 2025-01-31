// todos/todos.entity.ts
import { IsEnum, IsOptional, IsString } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Priority, Status } from "./enums";

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
    default: Priority.HIGH, // Default priority
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

  @Column({
    type: "boolean",
    default: true,
  })
  isScheduled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  completedAt: Date;
  setStatus(status: Status) {
    if (status === Status.COMPLETED) {
      return (this.completedAt = new Date());
    } else {
      return (this.completedAt = null);
    }
  }
}
