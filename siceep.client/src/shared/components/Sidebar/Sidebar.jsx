import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { SidebarContainer } from "./Sidebar.styles";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import logo from "../../../assets/Logo_p.png";
import { useAuth } from "../../../providers/Authenticacion/useAuth";
import { menuSections } from "./menuSections";

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

    const autoCerrarSidebar = () => {
        if (window.innerWidth <= 768) setSidebarOpen(false);
    };

    return (
        <SidebarContainer $isOpen={sidebarOpen} ref={sidebarRef}>
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