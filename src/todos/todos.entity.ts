// todos/todos.entity.ts
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Priority } from './enums/priority';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Status } from './enums/status';

@Entity()
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
    type: 'enum',
    enum: Priority,
    default: Priority.MEDIUM, // Default priority
  })
  @IsEnum(Priority)
  priority: Priority;

  @Column({
    type: 'enum',
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