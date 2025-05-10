import api from "./apiService";

export async function getBoards() {
    try {
        const response = await api.get("/boards");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des boards :", error);
        throw new Error("Impossible de récupérer les tableaux");
    }
}

export async function createBoard(name) {
    try {
        const response = await api.post("/boards", { name });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la création du tableau :", error);
        throw new Error("Impossible de créer le tableau");
    }
}

export async function joinBoard(code) {
    try {
        const response = await api.post("/boards/join", { code });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la tentative de rejoindre un tableau :", error);
        throw new Error("Impossible de rejoindre le tableau");
    }
}
