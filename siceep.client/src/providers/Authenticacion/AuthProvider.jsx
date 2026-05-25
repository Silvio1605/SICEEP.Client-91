import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { Login } from "./../../feature/auth/services/authService";

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const login = async (nombreUsuario, contraseña) => {

        const isValid = nombreUsuario.trim() !== "" && contraseña.trim() !== "";

        const auth = {
            nombreUsuario,
            contraseña
        };

        if (isValid) {
            const response = await Login(auth);
            const { token, mensaje } = response.data;
            
            if (token !== "" && token !== null && token !== undefined) {
                
                localStorage.setItem("token", token);
                setToken(token);
                return { valid: true, mensaje };
            }
        }

        return { valid: false, mensaje: "Credenciales inválidas" };
        
    };

    const logout = () => {

        localStorage.removeItem("token");

        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                login,
                logout,
                autenticado: !!token
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};