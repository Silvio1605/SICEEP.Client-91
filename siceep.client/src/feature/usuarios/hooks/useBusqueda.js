import { useContext } from "react";
import { BusquedaContext } from "./../context/BusquedaProvider";

export const useBusqueda = () => useContext(BusquedaContext);