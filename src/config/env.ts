import { z } from "zod";
import dotenvFlow from "dotenv-flow";

dotenvFlow.config({
  path: process.cwd(),
});

const envSchema = z.object({
  SUPABASE_URL: z.string().url("SUPABASE_URL must be a valid URL"),
  SUPABASE_ANON_KEY: z.string().min(5, "SUPABASE_ANON_KEY is required"),
  SUPABASE_SERVICE_ROLE: z.string().optional(),

  TELEGRAM_BOT_TOKEN: z.string().min(10, "TELEGRAM_BOT_TOKEN is required"),

  ASSEMBLY_API_KEY: z.string().min(10, "ASSEMBLY_API_KEY is required"),

//   PUBLIC_URL: z.string().url("PUBLIC_URL must be a valid URL").optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ ENV VALIDATION ERROR:\n", parsed.error.flatten());
  process.exit(1);
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;
