"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  createTask,
  updateTask,
  deleteTask,
  toggleTaskDone,
  type TaskInput,
} from "@/lib/actions/tasks";
import { TaskForm } from "@/components/task-form";
import { PriorityBadge } from "@/components/badges";
import { formatDate } from "@/lib/format";
import { isPast, isToday } from "date-fns";

type ContactOption = { id: string; fullName: string };

type TaskData = {
  id: string;
  title: string;
  notes: string | null;
  dueDate: Date | null;
  priority: "A" | "B" | "C" | "D" | "E";
  done: boolean;
  contactId: string | null;
  contact: { id: string; fullName: string } | null;
};

function DueBadge({ dueDate, done }: { dueDate: Date | null; done: boolean }) {
  if (done || !dueDate) return null;
  const overdue = isPast(dueDate) && !isToday(dueDate);
  const today = isToday(dueDate);
  if (overdue) {
    return (
      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
        Quá hạn
      </span>
    );
  }
  if (today) {
    return (
      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
        Hôm nay
      </span>
    );
  }
  return null;
}

function TaskRow({
  task,
  contacts,
}: {
  task: TaskData;
  contacts: ContactOption[];
}) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  if (editing) {
    return (
      <TaskForm
        initial={{
          title: task.title,
          notes: task.notes ?? "",
          dueDate: task.dueDate ? task.dueDate.toISOString().slice(0, 10) : "",
          priority: task.priority,
          contactId: task.contactId,
        }}
        contacts={contacts}
        submitLabel="Lưu thay đổi"
        onCancel={() => setEditing(false)}
        onSubmit={async (input: TaskInput) => {
          await updateTask(task.id, input);
          setEditing(false);
        }}
      />
    );
  }

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border bg-white p-4 ${
        task.done ? "border-neutral-200" : "border-neutral-200"
      }`}
    >
      <input
        type="checkbox"
        checked={task.done}
        disabled={pending}
        onChange={(e) =>
          startTransition(() => toggleTaskDone(task.id, e.target.checked))
        }
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <PriorityBadge priority={task.priority} />
          <span
            className={`text-sm font-medium ${
              task.done ? "text-neutral-400 line-through" : "text-neutral-900"
            }`}
          >
            {task.title}
          </span>
          <DueBadge dueDate={task.dueDate} done={task.done} />
        </div>
        {task.notes && (
          <p className="mt-1 text-sm text-neutral-500">{task.notes}</p>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-400">
          {task.dueDate && <span>{formatDate(task.dueDate)}</span>}
          {task.contact && (
            <Link
              href={`/contacts/${task.contact.id}`}
              className="text-blue-600 hover:underline"
            >
              {task.contact.fullName}
            </Link>
          )}
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-xs font-medium text-neutral-400 hover:text-neutral-700"
        >
          Sửa công việc
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (confirm("Xóa công việc này?")) {
              startTransition(() => deleteTask(task.id));
            }
          }}
          className="text-xs font-medium text-neutral-400 hover:text-red-600"
        >
          Xóa
        </button>
      </div>
    </div>
  );
}

export function TasksClient({
  tasks,
  contacts,
}: {
  tasks: TaskData[];
  contacts: ContactOption[];
}) {
  const [showForm, setShowForm] = useState(false);

  const pending = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900">Công việc</h1>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            + Thêm công việc
          </button>
        )}
      </div>

      {showForm && (
        <TaskForm
          contacts={contacts}
          submitLabel="Tạo công việc"
          onCancel={() => setShowForm(false)}
          onSubmit={async (input) => {
            await createTask(input);
            setShowForm(false);
          }}
        />
      )}

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-700">
          Chưa hoàn thành ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="rounded-lg border border-dashed border-neutral-200 px-4 py-6 text-center text-sm text-neutral-400">
            Không có công việc nào đang chờ.
          </p>
        ) : (
          <div className="space-y-2">
            {pending.map((t) => (
              <TaskRow key={t.id} task={t} contacts={contacts} />
            ))}
          </div>
        )}
      </div>

      {done.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-neutral-700">
            Đã hoàn thành ({done.length})
          </h2>
          <div className="space-y-2">
            {done.map((t) => (
              <TaskRow key={t.id} task={t} contacts={contacts} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
