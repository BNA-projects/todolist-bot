import { supabase } from "../lib/supabase";

export interface Task {
  id: string;
  tg_user_id: number;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  date: string | null;
  topic: string;
}

export async function saveTaskToDb(userId: number, text: string) {
  const { data, error } = await supabase
    .from("tasks")
    .insert([{ tg_user_id: userId, title: text, topic: "Uncategorized" }])
    .select();

  if (error) {
    console.error("❌ Error saving task:", error.message);
  } else {
    console.log("✅ Task saved:", data);
  }
}

export async function getLastTask(userId: number): Promise<Task | null> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("tg_user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("❌ Error fetching last task:", error.message);
    return null;
  }

  return data;
}

export async function updateTaskTopic(userId: number, topic: string) {
  const lastTask = await getLastTask(userId);

  if (!lastTask) {
    console.warn("⚠️ No task found to update topic.");
    return;
  }

  const { error } = await supabase
    .from("tasks")
    .update({ topic })
    .eq("id", lastTask.id);

  if (error) {
    console.error("❌ Error updating topic:", error.message);
  } else {
    console.log(`✅ Task topic updated to (${topic}) for userId ${userId}`);
  }
}

export async function updateTaskText(userId: number, newText: string) {
  const lastTask = await getLastTask(userId);

  if (!lastTask) {
    console.warn("⚠️ No task found to update text.");
    return;
  }

  const { error } = await supabase
    .from("tasks")
    .update({ title: newText })
    .eq("id", lastTask.id);

  if (error) {
    console.error("❌ Error updating task text:", error.message);
  } else {
    console.log(`✅ Task text updated for userId ${userId}`);
  }
}
