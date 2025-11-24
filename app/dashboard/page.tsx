"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
export default function Home() {
  const router = useRouter();
  const [Content, setContent] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [editedText, setEditedText] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // ADD Task
  const handleAdd = async () => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ Content }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Task added successfully");
        setContent("");
        setTasks([...tasks, data]); // add new task immediately
      } else {
        alert(data.error || "Failed to add task");
      }
    } catch (err: any) {
      console.error("Error adding task:", err.message);
    }
  };

  // FETCH All Tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch tasks");

        const data = await response.json();
        setTasks(data);
      } catch (err: any) {
        console.error("Error fetching tasks:", err.message);
      }
    };

    fetchTasks();
  }, []);
  
  // SAVE (EDIT) Task
  const handleSave = async (id: string) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          taskId: id,
          editedText,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Task updated successfully");

        // Update UI instantly
        setTasks(
          tasks.map((t) =>
            t.id === id ? { ...t, content: editedText } : t
          )
        );

        // Close edit mode
        setEditingTaskId(null);
      }
    } catch (err: any) {
      console.error("Error updating task:", err.message);
    }
  };

  // DELETE Task
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ taskId: id }),
      });

      if (response.ok) {
        setTasks(tasks.filter((t) => t.id !== id));
      }
    } catch (err: any) {
      console.error("Error deleting task:", err.message);
    }
  };

  // STATUS UPDATE
  const handleStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch("/api/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ taskId: id, status: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Status updated");

        // Update UI
        setTasks(
          tasks.map((t) =>
            t.id === id ? { ...t, status: newStatus } : t
          )
        );
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err: any) {
      console.error("Error updating status:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md">
        
        <div className="relative mb-6">
          <h1 className="text-3xl font-bold text-center text-black">
            To-Do List
          </h1>

          <button
            onClick={() => router.push("/search_page")}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-200 transition"
          >
            <Search className="w-6 h-6 text-gray-700" />
          </button>
        </div>


        
        {/* Input + Add */}
        <div className="flex gap-3 mb-5">
          <input
            type="text"
            placeholder="Enter a task..."
            value={Content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 border border-black text-black placeholder-gray-400 rounded-md px-4 py-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            onClick={handleAdd}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>

        {/* Tasks */}
        <div>
          {tasks.length === 0 ? (
            "No tasks"
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex justify-between items-center bg-gray-50 border p-3 rounded-md shadow-sm mb-3"
              >
                <div className="flex-1">

                  {/* If currently editing this task */}
                  {editingTaskId === task.id ? (
                    <>
                      <input
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="border border-black rounded-md px-2 py-1 w-full text-black"
                      />

                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleSave(task.id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Save
                        </button>

                        <button
                          onClick={() => setEditingTaskId(null)}
                          className="px-3 py-1 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-medium text-black">
                        {task.content}
                      </p>
                      <p className="text-xs text-gray-500">
                        Status: {task.status}
                      </p>

                      {task.status === "completed" ? (
                        <button
                          onClick={() => handleStatus(task.id, "todo")}
                          className="mt-2 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 transition"
                        >
                          Mark as Pending
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatus(task.id, "completed")}
                          className="mt-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition"
                        >
                          Mark Completed
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* right side buttons */}
                <div className="flex flex-col gap-2 ml-4">

                  {/* Show Edit only if not editing */}
                  {editingTaskId !== task.id && (
                    <button
                      onClick={() => {
                        setEditingTaskId(task.id);
                        setEditedText(task.content); // default value
                      }}
                      className="text-blue-600 font-semibold hover:text-blue-800"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-500 font-semibold hover:text-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
