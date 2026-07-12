import React, {  useState, useMemo, useCallback } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { NotificacionContext } from "./NotificacionContext";

export const NotificacionProvider = ({ children }) => {

    const [open, setOpen] = useState(false);

    const [notificacion, setNotificacion] = useState({
        message: "",
        severity: "success",
    });

    const mostrarNotificacion = useCallback(({
        message,
        severity = "success",
    }) => {

        setNotificacion({
            message,
            severity,
        });

        setOpen(true);
    }, []);

    const handleClose = (_, reason) => {

        if (reason === "clickaway") return;

        setOpen(false);
    };

    const value = useMemo(() => ({
         mostrarNotificacion
    }), [mostrarNotificacion]);

    return (
        <NotificacionContext.Provider
            value={value}
        >
            {children}

            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                <Alert
                    onClose={handleClose}
                    severity={notificacion.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {notificacion.message}
                </Alert>
            </Snackbar>

        </NotificacionContext.Provider>
    );
};