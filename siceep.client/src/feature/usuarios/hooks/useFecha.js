import { updateExpiracion } from "./../services/usuarioService";

export const useFecha = () => {

    const esFechaValida = (fecha) => {
        const f = new Date(fecha);
        return !isNaN(f.getTime());
    };

    const tiempoRestante = (fecha) => {

        if (!fecha) return "Fecha inválida";

        // Convertir de dd/MM/yyyy a yyyy-MM-dd
        let objetivo;

        if (fecha.includes("/")) {
            const [dia, mes, anio] = fecha.split("/").map(Number);
            objetivo = new Date(anio, mes - 1, dia);
        } else {
            // ya viene en formato correcto (YYYY-MM-DD)
            objetivo = new Date(fecha);
        }

        if (isNaN(objetivo.getTime())) {
            return "Fecha inválida";
        }

        const ahora = new Date();

        if (objetivo <= ahora) return "Cuenta Expirada";

        let anios = objetivo.getFullYear() - ahora.getFullYear();
        let meses = objetivo.getMonth() - ahora.getMonth();
        let dias = objetivo.getDate() - ahora.getDate();

        if (dias < 0) {
            meses--;
            const diasMesAnterior = new Date(
                objetivo.getFullYear(),
                objetivo.getMonth(),
                0
            ).getDate();
            dias += diasMesAnterior;
        }

        if (meses < 0) {
            anios--;
            meses += 12;
        }

        const partes = [];

        if (anios > 0) partes.push(`${anios} año${anios > 1 ? "s" : ""}`);
        if (meses > 0) partes.push(`${meses} mes${meses > 1 ? "es" : ""}`);
        if (dias > 0) partes.push(`${dias} día${dias > 1 ? "s" : ""}`);

        return partes.length > 0 ? partes.join(", ") : "Hoy";
    };

    const convertirFecha = (fecha) => {

        if (!esFechaValida(fecha)) {
            return obtenerFechaActual();
        }
        const [dia, mes, anio] = fecha.split('/');
        const fechaFormateada = `${anio}-${mes}-${dia}`;

        return fechaFormateada;
    }

    const esMayor = (fechaActual, fechaNueva) => {
        return new Date(fechaNueva) > new Date(fechaActual);
    };

    const obtenerFechaActual = () => {
        const hoy = new Date();
        return hoy.getFullYear() + '-' +
            String(hoy.getMonth() + 1).padStart(2, '0') + '-' +
            String(hoy.getDate()).padStart(2, '0');
    };


    const actualizarFechaExpiracion = async (nombreUsuario, nuevaFecha) => {

        if (!esFechaValida(nuevaFecha)) {
            return Promise.reject("Fecha inválida");
        }

        if (!esMayor(obtenerFechaActual(), nuevaFecha)) {
            return Promise.reject("La nueva fecha debe ser mayor a la fecha actual");
        }

        if (!nombreUsuario) {
            return Promise.reject("Nombre de usuario no válido");
        }

        const usuarioActualizado = {
            usuario: nombreUsuario,
            fechaExpiracion: nuevaFecha
        };
        return updateExpiracion(usuarioActualizado);
    }

    return { tiempoRestante, convertirFecha, esMayor, obtenerFechaActual, actualizarFechaExpiracion };
};