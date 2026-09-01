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
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import DomainIcon from '@mui/icons-material/Domain';
import BadgeIcon from '@mui/icons-material/Badge';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import DescriptionIcon from '@mui/icons-material/Description';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BarChartIcon from '@mui/icons-material/BarChart';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import logo from "../../../assets/Logo_p.png";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import { useAuth } from "../../../providers/Authenticacion/useAuth";
import { Rutas } from "./../../../routes/routes";

const menuSections = [
    {
        titulo: "Seguridad",
        items: [
            { text: "Usuarios", icon: <PersonIcon />, path: Rutas.USUARIOS, idPermiso: 1 },
            { text: "Permisos", icon: <KeyIcon />, path: Rutas.PERMISOS, idPermiso: 1 },
            { text: "Historial", icon: <HistoryEduIcon />, path: Rutas.HISTORIAL, idPermiso: 1 },
        ]
    },
    {
        titulo: "Localizacion",
        items: [
            { text: "Ubicacion", icon: <DomainIcon />, path: Rutas.UBICACION, idPermiso: 3 },
        ]
    },
    {
        titulo: "Expediente",
        items: [
            { text: "Buscar Expediente", icon: <BadgeIcon />, path: Rutas.EXPEDIENTES, idPermiso: 3 },
            { text: "Nuevo Expediente", icon: <AddBoxIcon />, path: Rutas.CREAR_EXPEDIENTE, idPermiso: 3 }
        ]
    },
    {
        titulo: "Tramites y Atención",
        items: [
            { text: "Busqueda Rapida", icon: <ManageSearchIcon />, path: "/index/busqueda-rapida", idPermiso: 3 },
            { text: "Gestion Documentos", icon: <DescriptionIcon />, path: "/index/gestion-documentos", idPermiso: 3 },
            { text: "Gestion Deducciones", icon: <AccountBalanceWalletIcon />, path: Rutas.DEDUCCIONES, idPermiso: 3 }
        ]
    },
    {
        titulo: "Reportes y estadisticas",
        items: [
            { text: "Reportes", icon: <AssessmentIcon />, path: "/index/reportes", idPermiso: 3 },
            { text: "Estadisticas", icon: <BarChartIcon />, path: "/index/estadisticas", idPermiso: 3 },
            { text: "Herramientas de Ayuda", icon: <HelpCenterIcon />, path: "/index/herramientas-ayuda", idPermiso: 3 },
        ]
    },
    {
        titulo: "Sesión",
        items: [
            { text: "Cerrar Sesión", icon: <ExitToAppIcon />, path: "/", isLogout: true, idPermiso: 4 },
        ]
    }
];

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
                    const hasVisibleItems = section.items.some(item => tienePermiso(item.idPermiso));
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

                                        return tienePermiso(item.idPermiso) && (
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