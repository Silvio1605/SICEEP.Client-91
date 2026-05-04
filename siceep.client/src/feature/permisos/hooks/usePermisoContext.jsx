import { useContext } from "react";
import { PermisoContext } from "./../context/PermisoContext";

export const usePermisosContext = () => {
    const context = useContext(PermisoContext);

    return context;
};

