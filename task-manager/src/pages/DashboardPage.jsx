import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createBoard, joinBoard } from "../services/boardsService";
import { useAuth } from "../hooks/useAuth";
import { db, ref, onValue } from "../services/firebase";

export default function DashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [boardName, setBoardName] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [error, setError] = useState("");
    const [boards, setBoards] = useState([]);

    useEffect(() => {
        const boardsRef = ref(db, "boards");

        const unsubscribe = onValue(boardsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const boardsArray = Object.values(data);
                setBoards(boardsArray);
            } else {
                setBoards([]);
            }
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, []);

    const handleCreateBoard = async (e) => {
        e.preventDefault();
        setError("");
        if (!boardName) return setError("Le nom du board est requis.");

        try {
            await createBoard(boardName);
            setBoardName("");
        } catch (err) {
            setError("Erreur lors de la création du board.");
        }
    };

    const handleJoinBoard = async (e) => {
        e.preventDefault();
        setError("");
        if (!joinCode) return setError("Le code est requis.");

        try {
            const joinedBoard = await joinBoard(joinCode);
            navigate(`/board/${joinedBoard.boardId}`);
        } catch (err) {
            setError("Erreur lors de la tentative de rejoindre le board.");
        }
    };

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">Bienvenue {user?.displayName || user?.email}</h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleCreateBoard} className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Créer un nouveau board</h2>
                <input
                    type="text"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                    className="border border-gray-300 px-4 py-2 rounded w-full mb-2"
                    placeholder="Nom du board"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                    Créer
                </button>
            </form>

            <form onSubmit={handleJoinBoard}>
                <h2 className="text-xl font-semibold mb-2">Rejoindre un board via un code</h2>
                <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="border border-gray-300 px-4 py-2 rounded w-full mb-2"
                    placeholder="Code du board"
                />
                <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                >
                    Rejoindre
                </button>
            </form>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Mes boards (temps réel)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {boards.map((board) => (
                        <div
                            key={board.id}
                            className="border p-4 rounded bg-white shadow hover:shadow-lg cursor-pointer"
                            onClick={() => navigate(`/board/${board.id}`)}
                        >
                            <h3 className="text-lg font-bold">{board.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">Code: {board.code}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
