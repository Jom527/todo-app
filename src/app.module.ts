// src/app.module.ts
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TodosModule } from "./todos/todos.module";
import { Todo } from "./todos/todos.entity";
import appConfig from "./config/app.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig], // Load custom configuration
      isGlobal: true, // Make the config globally available
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule to use ConfigService
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get("app.db");
        return {
          type: dbConfig.type,
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          entities: [Todo],
          synchronize: process.env.NODE_ENV !== "production", // Disable synchronize in production
        };
      },
      inject: [ConfigService],
    }),
    TodosModule,
  ],
})
export class AppModule {}
