import { useContext } from "react";
import { NotificacionContext } from "./NotificacionContext";

export const useNotificacionContext = () => {
    return useContext(NotificacionContext);
};