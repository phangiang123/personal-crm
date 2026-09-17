import { listTasks } from "@/lib/actions/tasks";
import { listContactOptions } from "@/lib/actions/contacts";
import { TasksClient } from "./tasks-client";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const [tasks, contacts] = await Promise.all([
    listTasks(),
    listContactOptions(),
  ]);

  return <TasksClient tasks={tasks} contacts={contacts} />;
}
