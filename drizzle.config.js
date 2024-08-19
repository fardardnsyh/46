import { defineConfig } from "drizzle-kit";
 
export default defineConfig({
  schema: "./configs/schema.js",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://accounts:YNRQA47ldUms@ep-polished-sunset-a5c6ozn6.us-east-2.aws.neon.tech/AI-Form-Builder?sslmode=require',
  }
});