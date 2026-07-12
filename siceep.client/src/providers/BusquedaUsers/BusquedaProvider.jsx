import { useMemo, useState } from "react";
import { BusquedaContext } from "./BusquedaContext"; 

export function BusquedaProvider({ children }) {

    const [idSeleccionado, setIdSeleccionado] = useState(null);

    const value = useMemo(() => ({
        idSeleccionado,
        setIdSeleccionado
    }), [idSeleccionado]);

    return (
        <BusquedaContext.Provider value={value}>
            {children}
        </BusquedaContext.Provider>
    );
}
