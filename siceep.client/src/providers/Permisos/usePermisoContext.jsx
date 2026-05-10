import { useContext } from "react";
import { PermisoContext } from "./PermisoContext";

export const usePermisosContext = () => {
    const context = useContext(PermisoContext);

    return context;
};

