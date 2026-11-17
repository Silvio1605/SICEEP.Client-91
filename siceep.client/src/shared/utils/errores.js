// Normaliza cualquier error (axios, API, JS) a un texto seguro para renderizar.
//
// El backend responde con { mensaje } en los 401/403 (ver Program.cs y
// GlobalExceptionMiddleware) y con { message } en las respuestas de validación.
// Si el objeto se pasa tal cual a un componente de React se produce el
// error #31 ("Objects are not valid as a React child").
export const mensajeDeError = (error, porDefecto = 'Ocurrió un error inesperado.') => {
    if (!error) return porDefecto;

    const data = error?.response?.data;

    if (typeof data === 'string' && data.trim()) return data.trim();

    const texto = data?.mensaje
        ?? data?.message
        ?? error?.mensaje
        ?? error?.message;

    return typeof texto === 'string' && texto.trim() ? texto.trim() : porDefecto;
};
