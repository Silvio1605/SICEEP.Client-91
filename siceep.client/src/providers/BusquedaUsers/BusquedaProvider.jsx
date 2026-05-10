import { useState } from "react";
import { BusquedaContext } from "./BusquedaContext"; 

export function BusquedaProvider({ children }) {
    const [idSeleccionado, setIdSeleccionado] = useState(null);
    return (
        <BusquedaContext.Provider value={{ idSeleccionado, setIdSeleccionado }}>
            {children}
        </BusquedaContext.Provider>
    );
}
