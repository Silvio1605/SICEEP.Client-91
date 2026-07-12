import { useMemo } from "react";
import { usePermisos } from "./../../feature/permisos/hooks/usePermisos";
import { PermisoContext } from "./PermisoContext";


export const PermisoProvider = ({ children, idUsuario }) => {

    const permisosHook = usePermisos(idUsuario);

    const value = useMemo(() => ({
        permisosHook
    }), [permisosHook]);

    return (
        <PermisoContext.Provider value={value}>
            {children}
        </PermisoContext.Provider>
    );
};
