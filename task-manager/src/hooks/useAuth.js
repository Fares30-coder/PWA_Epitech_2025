import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { auth } from "../services/firebase";

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");

    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const token = await user.getIdToken();
            context.login({ user, token });
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            let message = "Une erreur est survenue.";
            let field = null;
            switch (error.code) {
                case "auth/invalid-email":
                    message = "L'adresse email est invalide.";
                    field = "email";
                    break;
                case "auth/user-disabled":
                    message = "Ce compte est désactivé.";
                    break;
                case "auth/user-not-found":
                    message = "Aucun compte trouvé pour cet email.";
                    field = "email";
                    break;
                case "auth/wrong-password":
                    message = "Mot de passe incorrect.";
                    field = "password";
                    break;
                default:
                    message = "Erreur lors de la connexion.";
            }
            throw { message, field };
        }
    };

    const register = async (name, email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await updateProfile(user, { displayName: name });
            const token = await user.getIdToken();
            context.login({ user, token });
        } catch (error) {
            console.error("Erreur lors de l'inscription :", error);
            let message = "Une erreur est survenue.";
            let field = null;
            switch (error.code) {
                case "auth/email-already-in-use":
                    message = "Cet email est déjà utilisé.";
                    field = "email";
                    break;
                case "auth/invalid-email":
                    message = "L'adresse email est invalide.";
                    field = "email";
                    break;
                case "auth/weak-password":
                    message = "Le mot de passe est trop faible (au moins 6 caractères).";
                    field = "password";
                    break;
                default:
                    message = "Erreur lors de l'inscription.";
            }
            throw { message, field };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            context.logout();
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        }
    };

    return {
        ...context,
        login,
        register,
        logout,
    };
}
