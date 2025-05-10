export default function TaskCard({ task }) {
  return (
    <div className="bg-gray-100 rounded shadow p-2">
      <div className="font-medium">{task.title}</div>
    </div>
  );
}
