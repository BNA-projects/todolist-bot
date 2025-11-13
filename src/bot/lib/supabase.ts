import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://rtvhliurdhiyuzswixrk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0dmhsaXVyZGhpeXV6c3dpeHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5ODAyMTYsImV4cCI6MjA3ODU1NjIxNn0.u7V_acmKPKVObCP8XLQ8ikNVgfx9BHEF3VcDg4g8yvw"; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
async function testSupabaseConnection() {
  console.log("🚀 Проверяем подключение к Supabase...");

  const { data, error } = await supabase.from("tasks").select("*").limit(1);

  if (error) {
    console.error("❌ Ошибка подключения к Supabase:", error.message);
  } else {
    console.log("✅ Подключение к Supabase успешно!");
    console.log("📦 Пример данных из таблицы tasks:", data);
  }
}

testSupabaseConnection();