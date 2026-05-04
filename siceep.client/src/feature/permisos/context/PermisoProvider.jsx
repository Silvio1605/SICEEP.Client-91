import { usePermisos } from "./../hooks/usePermisos";
import { PermisoContext } from "./PermisoContext";

export const PermisoProvider = ({ children, idUsuario }) => {

    const permisosHook = usePermisos(idUsuario);    

    return (
        <PermisoContext.Provider value={{permisosHook}}>
            {children}
        </PermisoContext.Provider>
    );
};
