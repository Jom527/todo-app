import { ConfigModule, registerAs } from "@nestjs/config";
import * as Joi from "joi";

export default registerAs("app", async () => {
  await ConfigModule.envVariablesLoaded;

  // Define the schema for validation
  const schema = Joi.object({
    DB_TYPE: Joi.string().default("mysql"),
    DB_HOST: Joi.string().default("localhost"),
    DB_PORT: Joi.number().default(3306),
    DB_USERNAME: Joi.string().default("root"),
    DB_PASSWORD: Joi.string().allow("").default(""),
    DB_DATABASE: Joi.string().default("todo_app"),
  });

  const { error, value: validatedEnv } = schema.validate(process.env, {
    allowUnknown: true,
    abortEarly: false,
  });

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return {
    db: {
      type: validatedEnv.DB_TYPE,
      host: validatedEnv.DB_HOST,
      port: validatedEnv.DB_PORT,
      username: validatedEnv.DB_USERNAME,
      password: validatedEnv.DB_PASSWORD,
      database: validatedEnv.DB_DATABASE,
    },
  };
});
