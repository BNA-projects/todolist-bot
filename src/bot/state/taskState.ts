// Переместить в БД
export const userTasks = new Map<number, string>();

export function saveTask(userId: number, text: string) {
  userTasks.set(userId, text);
}

export function getTask(userId: number): string | undefined {
  return userTasks.get(userId);
}

export function clearTask(userId: number) {
  userTasks.delete(userId);
}
