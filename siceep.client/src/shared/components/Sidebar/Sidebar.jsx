import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { SidebarContainer } from "./Sidebar.styles";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import BadgeIcon from '@mui/icons-material/Badge';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import DescriptionIcon from '@mui/icons-material/Description';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BarChartIcon from '@mui/icons-material/BarChart';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import WorkIcon from '@mui/icons-material/Work';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import logo from "../../../assets/Logo_p.png";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import { useAuth } from "../../../providers/Authenticacion/useAuth";
import { RECURSO } from "../../constants/recursos";
import { Rutas } from "./../../../routes/routes";

// Los idPermiso son los Id_Recurso de dbo.Recurso. El servidor resuelve cada
// endpoint por el nombre del recurso (PermisoRequirement), asi que el menu debe
// usar el mismo recurso para que lo que se ve coincida con lo que la API permite.
const menuSections = [
    {
        titulo: "Seguridad",
        items: [
            { text: "Usuarios", icon: <PersonIcon />, path: Rutas.USUARIOS, idPermiso: RECURSO.REGISTRAR_USUARIO },
            { text: "Permisos", icon: <KeyIcon />, path: Rutas.PERMISOS, idPermiso: RECURSO.ASIGNAR_PERMISOS },
            { text: "Historial", icon: <HistoryEduIcon />, path: Rutas.HISTORIAL, idPermiso: RECURSO.HISTORIAL_ACTIVIDAD },
        ]
    },
    {
        titulo: "Expediente",
        items: [
            { text: "Buscar Expediente", icon: <BadgeIcon />, path: Rutas.EXPEDIENTES, idPermiso: RECURSO.CONSULTAR_EXPEDIENTES },
            { text: "Nuevo Expediente", icon: <AddBoxIcon />, path: Rutas.CREAR_EXPEDIENTE, idPermiso: RECURSO.REGISTRAR_EXPEDIENTE }
        ]
    },
    {
        titulo: "Tramites y Atención",
        items: [
            { text: "Busqueda Rapida", icon: <ManageSearchIcon />, path: "/index/busqueda-rapida", idPermiso: RECURSO.BUSQUEDA_RAPIDA },
            { text: "Gestion Documentos", icon: <DescriptionIcon />, path: "/index/gestion-documentos", idPermiso: RECURSO.DOCUMENTOS_EXPEDIENTE }
        ]
    },
    {
        titulo: "Gestión Laboral",
        items: [
            { text: "Plazas", icon: <WorkIcon />, path: "/index/plazas", idPermiso: RECURSO.PLAZAS_Y_CARGOS },
            { text: "Movimientos", icon: <SwapHorizIcon />, path: "/index/movimientos", idPermiso: RECURSO.MOVIMIENTOS_Y_RECORRIDO },
            { text: "Deducciones", icon: <ReceiptLongIcon />, path: "/index/deducciones", idPermiso: RECURSO.DEDUCCIONES },
            { text: "Ubicaciones", icon: <LocationOnIcon />, path: "/index/catalogos-ubicaciones", idPermiso: RECURSO.UBICACIONES_Y_UNIDADES },
        ]
    },
    {
        titulo: "Reportes y estadisticas",
        items: [
            // Reportes muestra tres recursos distintos (fuerza laboral, altas y
            // bajas y panel); basta con tener alguno de los tres.
            { text: "Reportes", icon: <AssessmentIcon />, path: "/index/reportes", idPermiso: [RECURSO.FUERZA_LABORAL, RECURSO.ALTAS_Y_BAJAS, RECURSO.PANEL_INDICADORES] },
            { text: "Estadisticas", icon: <BarChartIcon />, path: "/index/estadisticas", idPermiso: RECURSO.PANEL_INDICADORES },
            { text: "Herramientas de Ayuda", icon: <HelpCenterIcon />, path: "/index/herramientas-ayuda", soloAutenticado: true },
        ]
    },
    {
        titulo: "Formación académica",
        items: [
            { text: "Consulta Académica", icon: <MenuBookIcon />, path: "/index/consulta-academica", idPermiso: RECURSO.FORMACION_ACADEMICA },
            { text: "Instituciones Académicas", icon: <SchoolIcon />, path: Rutas.INSTITUCIONES, idPermiso: RECURSO.INSTITUCIONES_ACADEMICAS },
        ]
    },
    {
        titulo: "Sesión",
        items: [
            { text: "Mi Cuenta", icon: <AccountCircleIcon />, path: Rutas.CONFIGURACION, soloAutenticado: true },
            { text: "Cerrar Sesión", icon: <ExitToAppIcon />, path: "/", isLogout: true, idPermiso: RECURSO.ACTUALIZAR_EXPIRACION_CUENTA },
        ]
    }
];

// Un ítem es visible si no exige permiso (logout, o cualquier opción propia de la
// sesión como Mi Cuenta) o si el usuario tiene el permiso asignado.
const esVisible = (item, tienePermiso) =>
    item.isLogout || item.soloAutenticado || tienePermiso(item.idPermiso);

export function Sidebar({ sidebarOpen, setSidebarOpen }) {
    const [openSections, setOpenSections] = useState({});
    const { logout, tienePermiso } = useAuth();
    const sidebarRef = useRef(null);

    useEffect(() => {
        if (!sidebarOpen) return;

        const handleClickOutside = (event) => {
            if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [sidebarOpen, setSidebarOpen]);

    const handleToggleSection = (titulo) => {
        if (!sidebarOpen) setSidebarOpen(true);
        setOpenSections((prev) => ({
            ...prev,
            [titulo]: !prev[titulo],
        }));
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const autoCerrarSidebar = () => {
        if (window.innerWidth <= 768) setSidebarOpen(false);
    };

    return (
        <SidebarContainer $isOpen={sidebarOpen} ref={sidebarRef}>
            <button className="Sidebarbutton" onClick={toggleSidebar}>
               <ArrowBackIosNewIcon />
            </button>

            <div className="Logocontent">
                <div className="imgcontent">
                    <img src={logo} alt="Logo SeguraNica S.A." />
                </div>
                <h2>SeguraNica S.A.</h2>
            </div>

            <div className="MenuScroll">
                {menuSections.map((section) => {
                    const hasVisibleItems = section.items.some(item => esVisible(item, tienePermiso));
                    if (!hasVisibleItems) return null;

                    return (
                        <div key={section.titulo} className="SectionContainer">
                            <div className="CategoryHeader" onClick={() => handleToggleSection(section.titulo)}>
                                {sidebarOpen ? (
                                    <>
                                        <span className="CategoryTitle">{section.titulo}</span>
                                        {openSections[section.titulo] ? <ExpandLess /> : <ExpandMore />}
                                    </>
                                ) : (
                                    <div className="ClosedIndicator" />
                                )}
                            </div>
                            <Collapse in={openSections[section.titulo]} timeout="auto" unmountOnExit>
                                <div className="ItemsContainer">
                                    {section.items.map((item) => {
                                        const rutaCorrecta = item.path === "/" || item.path.startsWith("/index")
                                            ? item.path
                                            : `/index${item.path.startsWith("/") ? "" : "/"}${item.path}`;

                                        return esVisible(item, tienePermiso) && (
                                            <div className="LinkContainer" key={item.text}>
                                                <NavLink
                                                    to={rutaCorrecta}
                                                    className={({ isActive }) => `Links${isActive ? " active" : ""}`}
                                                    onClick={() => {
                                                        if (item.isLogout) {
                                                            logout();
                                                        } else {
                                                            autoCerrarSidebar();
                                                        }
                                                    }}
                                                >
                                                    <div className="Linkicon">{item.icon}</div>
                                                    {sidebarOpen && <span>{item.text}</span>}
                                                </NavLink>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Collapse>
                        </div>
                    );
                })}
            </div>
        </SidebarContainer>
    );
}