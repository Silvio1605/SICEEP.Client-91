import React, { useState, useCallback, useRef } from 'react';
import {
    Box, Typography, Divider, ListItemIcon, Menu, MenuItem
} from '@mui/material';

import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import FolderSharedIcon from '@mui/icons-material/FolderShared';

import { getExpedienteCompleto, getEstudios } from '../../expedientes/services/expedienteService';
import { mapearCompletoADetalle } from '../../expedientes/utils/expedienteMappers';
import { generarFichaExpedienteURL, obtenerFotoPerfilURL } from '../../expedientes/services/pdfService.jsx';
import { getHistorial } from '../../laboral/services/laboralServices';
import { getConstanciaBaja } from '../../reportes/services/reporteService';
import {
    generarConstanciaBajaURL,
    generarConstanciaFamiliarURL,
    generarConstanciaLaboralURL,
    generarConstanciaRecorridoURL,
    generarConstanciaSalarialURL,
} from '../../reportes/pdf/constanciasPdfService';
import ModalVistaPreviaPDF from '../../expedientes/components/ModalVistaPreviaPDF';
import ModalOpcionesImpresion from '../components/ModalOpcionesImpresion';
import ModalDocumentosDigitales from '../components/ModalDocumentosDigitales';
import TablaExpedientes from '../components/TablaExpedientes';
import useExpedientes from '../hooks/useExpedientes';


// Traduce las opciones del modal (fichaCompleta, etc.) a las que espera el PDF
const mapearOpcionesImpresion = (opciones) => {
    if (opciones.fichaCompleta) return { todo: true };
    const secciones = {
        personal: opciones.infoPersonal,
        familiar: opciones.infoFamiliar,
        laboral: opciones.trayectoria,
        academica: opciones.perfilAcademico,
    };
    // Si ninguna se marcó, se imprime todo
    const algunaMarcada = Object.values(secciones).some(Boolean);
    return algunaMarcada ? secciones : { todo: true };
};

export default function BusquedaRapida() {
    // Menu flotante / acciones
    const [anchorEl, setAnchorEl] = useState(null);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

    // Modal de opciones de impresión (claveImpresion re-monta el modal en cada apertura)
    const [modalImpresionAbierto, setModalImpresionAbierto] = useState(false);
    const [claveImpresion, setClaveImpresion] = useState(0);

    // Vista previa del PDF
    const [generandoPDF, setGenerandoPDF] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [vistaPreviaAbierta, setVistaPreviaAbierta] = useState(false);
    const [nombreDescarga, setNombreDescarga] = useState('Documento.pdf');
    const fotoUrlRef = useRef(null);

    // Modal de Documentos Digitales (claveDocs re-monta el modal en cada apertura)
    const [modalDocsAbierto, setModalDocsAbierto] = useState(false);
    const [claveDocs, setClaveDocs] = useState(0);

    // Búsqueda y paginación de expedientes (en el hook useExpedientes)
    const { expedientes, total, cargando, error, busqueda, page, manejarBusqueda, cambiarPagina } = useExpedientes();

    const isMenuOpen = Boolean(anchorEl);

    const abrirMenuOpciones = useCallback((event, empleado) => {
        setAnchorEl(event.currentTarget);
        setEmpleadoSeleccionado(empleado);
    }, []);

    const cerrarMenuOpciones = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const abrirModal = useCallback(() => {
        cerrarMenuOpciones();
        setClaveImpresion((c) => c + 1); // re-monta el modal para que reinicie las opciones
        setModalImpresionAbierto(true);
    }, [cerrarMenuOpciones]);

    const cargarExpedienteCompleto = async (empleado) => {
        const dto = (await getExpedienteCompleto(empleado?.id)).data;
        const detalle = mapearCompletoADetalle(dto);
        const estudios = dto?.persona?.idPersona
            ? (await getEstudios(dto.persona.idPersona).catch(() => ({ data: [] }))).data
            : [];
        return { dto, detalle, estudios };
    };

    const generarConstancia = async (tipo) => {
        try {
            cerrarMenuOpciones();
            setGenerandoPDF(true);
            setVistaPreviaAbierta(true);

            const { dto } = await cargarExpedienteCompleto(empleadoSeleccionado);
            const codigo = dto?.codigo || empleadoSeleccionado?.codigo || 'sincodigo';
            const config = { numeroDocumento: `C-${codigo}` };

            if (tipo === 'baja') {
                // En BAJA muestra período laborado, salario y motivo de la baja
                const bajaDto = (await getConstanciaBaja(empleadoSeleccionado.id)).data;
                setNombreDescarga(`Constancia-Baja-${codigo}.pdf`);
                setPdfUrl(await generarConstanciaBajaURL(bajaDto, config));
                return;
            }

            if (tipo === 'recorrido') {
                const historial = (await getHistorial(empleadoSeleccionado.id).catch(() => ({ data: [] }))).data;
                if (!historial?.length) throw new Error('El empleado no presenta recorrido laboral registrado.');
                setNombreDescarga(`Constancia-Recorrido-${codigo}.pdf`);
                setPdfUrl(await generarConstanciaRecorridoURL({ ...dto }, historial, config));
                return;
            }

            if (tipo === 'familiar') {
                if (!dto?.familiares?.length) throw new Error('El expediente no contiene miembros de familia registrados.');
                setNombreDescarga(`Constancia-Familiar-${codigo}.pdf`);
                setPdfUrl(await generarConstanciaFamiliarURL({ ...dto }, config));
                return;
            }

            if (tipo === 'salarial') {
                setNombreDescarga(`Constancia-Salarial-${codigo}.pdf`);
                setPdfUrl(await generarConstanciaSalarialURL({ ...dto }, config));
                return;
            }

            setNombreDescarga(`Constancia-${codigo}.pdf`);
            setPdfUrl(await generarConstanciaLaboralURL({ ...dto }, config));
        } catch (err) {
            console.error('Error al generar la constancia: ', err);
            setVistaPreviaAbierta(false);
            setPdfUrl(null);
            if (typeof alert === 'function') alert(`Error al generar la constancia: ${err?.message || 'desconocido'}`);
        } finally {
            setGenerandoPDF(false);
        }
    };

    const manejarImpresion = async (opcionesSeleccionadas) => {
        try {
            setModalImpresionAbierto(false);
            setGenerandoPDF(true);
            setVistaPreviaAbierta(true);

            const { dto, detalle, estudios } = await cargarExpedienteCompleto(empleadoSeleccionado);
            setNombreDescarga(`Ficha-Expediente-${dto?.codigo || 'sin-codigo'}.pdf`);

            const fotoUrl = await obtenerFotoPerfilURL(dto);
            fotoUrlRef.current = fotoUrl;

            const opcionesPDF = mapearOpcionesImpresion(opcionesSeleccionadas);
            const url = await generarFichaExpedienteURL({ ...dto, ...detalle }, estudios, opcionesPDF, fotoUrl);
            setPdfUrl(url);
        } catch (err) {
            console.error("Error al generar el PDF: ", err);
            setVistaPreviaAbierta(false);
            setPdfUrl(null);
            if (typeof alert === 'function') alert(`Error al generar el documento: ${err?.message || 'desconocido'}`);
        } finally {
            setGenerandoPDF(false);
        }
    };

    const cerrarVistaPrevia = () => {
        if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        if (fotoUrlRef.current) {
            URL.revokeObjectURL(fotoUrlRef.current);
            fotoUrlRef.current = null;
        }
        setPdfUrl(null);
        setVistaPreviaAbierta(false);
    };

    // Abre el modal con los documentos digitales del funcionario seleccionado
    const abrirDocumentos = useCallback(() => {
        cerrarMenuOpciones();
        setClaveDocs((c) => c + 1); // re-monta el modal para que recargue los documentos
        setModalDocsAbierto(true);
    }, [cerrarMenuOpciones]);

    return (
        <Box sx={{ width: '100%', pb: 5 }}>
            <Typography variant="h5" color="text.primary" fontWeight="bold" sx={{ mb: 1 }}>
                Búsqueda Rápida
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
                Consulta ágil de expedientes y generación de reportes.
            </Typography>

            <TablaExpedientes
                expedientes={expedientes}
                total={total}
                cargando={cargando}
                error={error}
                busqueda={busqueda}
                page={page}
                onBuscar={manejarBusqueda}
                onCambiaPagina={cambiarPagina}
                onAbrirAcciones={abrirMenuOpciones}
            />

            {/* Menú flotante de acciones */}
            <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={cerrarMenuOpciones}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{ elevation: 3, sx: { minWidth: 200, mt: 0.5 } }}
            >
                <MenuItem onClick={abrirModal}>
                    <ListItemIcon><DescriptionIcon fontSize="small" color="primary" /></ListItemIcon>
                    Ficha
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => generarConstancia('laboral')}>
                    <ListItemIcon><AssignmentIcon fontSize="small" color="secondary" /></ListItemIcon>
                    Constancia Laboral
                </MenuItem>
                <MenuItem onClick={() => generarConstancia('salarial')}>
                    <ListItemIcon><PaymentsOutlinedIcon fontSize="small" color="success" /></ListItemIcon>
                    Constancia Salarial
                </MenuItem>
                <MenuItem onClick={() => generarConstancia('familiar')}>
                    <ListItemIcon><GroupOutlinedIcon fontSize="small" color="action" /></ListItemIcon>
                    Constancia Familiar
                </MenuItem>
                <MenuItem onClick={() => generarConstancia('baja')}>
                    <ListItemIcon><PersonOffOutlinedIcon fontSize="small" color="error" /></ListItemIcon>
                    Constancia de Baja
                </MenuItem>
                <MenuItem onClick={() => generarConstancia('recorrido')}>
                    <ListItemIcon><TimelineOutlinedIcon fontSize="small" color="warning" /></ListItemIcon>
                    Constancia de Recorrido
                </MenuItem>
                <Divider />
                <MenuItem onClick={abrirDocumentos}>
                    <ListItemIcon><FolderSharedIcon fontSize="small" color="info" /></ListItemIcon>
                    Documentos Digitales
                </MenuItem>
            </Menu>

            {/* Modal de opciones de impresión */}
            <ModalOpcionesImpresion
                key={`impresion-${claveImpresion}`}
                abierto={modalImpresionAbierto}
                alCerrar={() => setModalImpresionAbierto(false)}
                onImprimir={manejarImpresion}
            />

            {/* Vista previa del PDF */}
            <ModalVistaPreviaPDF
                abierto={vistaPreviaAbierta}
                pdfUrl={pdfUrl}
                nombreDescarga={nombreDescarga}
                cargando={generandoPDF}
                alCerrar={cerrarVistaPrevia}
            />

            {/* Modal de Documentos Digitales */}
            <ModalDocumentosDigitales
                key={`docs-${claveDocs}`}
                abierto={modalDocsAbierto}
                empleado={empleadoSeleccionado}
                alCerrar={() => setModalDocsAbierto(false)}
            />
        </Box>
    );
}
