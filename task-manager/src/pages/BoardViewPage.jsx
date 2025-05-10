import { useState, useEffect } from "react";
import Column from "../components/ColumnComponent";
import { getColumns, addColumn } from "../services/columnsService";
import { addTask } from "../services/tasksService";
import { useParams, useNavigate } from "react-router-dom";

export default function BoardViewPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [columns, setColumns] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", columnId: "" });
  const [newColumn, setNewColumn] = useState("");

  useEffect(() => {
    async function fetchColumns() {
      const data = await getColumns(boardId);
      const loaded = Object.values(data || {});
      setColumns(loaded);
      if (loaded.length) setNewTask((t) => ({ ...t, columnId: loaded[0].id }));
    }
    fetchColumns();
  }, [boardId]);

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    const task = await addTask(boardId, newTask.columnId, newTask.title);
    setColumns((prev) =>
      prev.map((col) =>
        col.id === newTask.columnId
          ? { ...col, tasks: [...(col.tasks || []), task] }
          : col
      )
    );
    setNewTask({ title: "", columnId: columns[0]?.id || "" });
  };

  const handleAddColumn = async () => {
    if (!newColumn.trim()) return;
    const col = await addColumn(boardId, newColumn);
    setColumns((prev) => [...prev, col]);
    setNewColumn("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-between items-center p-4 border-b bg-white shadow">
        <button onClick={() => navigate("/dashboard")} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
          ← Retour
        </button>
        <h1 className="text-xl font-bold">Trello Lite</h1>
        <div />
      </div>

      <div className="p-4 flex flex-wrap gap-4 justify-center items-end">
        <input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="border p-2 rounded" placeholder="Nom de tâche" />
        <select value={newTask.columnId} onChange={(e) => setNewTask({ ...newTask, columnId: e.target.value })} className="border p-2 rounded">
          {columns.map((col) => <option key={col.id} value={col.id}>{col.name}</option>)}
        </select>
        <button onClick={handleAddTask} className="bg-blue-500 text-white px-4 py-2 rounded">Ajouter tâche</button>
        <input value={newColumn} onChange={(e) => setNewColumn(e.target.value)} className="border p-2 rounded ml-4" placeholder="Nouvelle colonne" />
        <button onClick={handleAddColumn} className="bg-green-500 text-white px-4 py-2 rounded">Ajouter colonne</button>
      </div>

      <div className="flex gap-4 overflow-x-auto px-4 py-2">
        {columns.map((col, index) => (
          <Column key={col.id} column={col} boardId={boardId} setColumns={setColumns} />
        ))}
      </div>
    </div>
  );
}
