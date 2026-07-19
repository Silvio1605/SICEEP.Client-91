import { useState } from "react";
import { Outlet } from "react-router-dom";

// Componentes
import { Sidebar } from "../components/Sidebar/Sidebar";
import BarraNav from "../components/BarraNav";

// Estilos
import {
    MainContainer,
    PageContent,
    ContentWrapper,
    SidebarWrapper,
    OutletContainer
} from "./Index.styles";

const Index = () => {
    // Estado global de la vista
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <MainContainer>

            {/* Menú de navegación lateral */}
            <SidebarWrapper>
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            </SidebarWrapper>

            {/* Panel derecho principal */}
            <PageContent>
                <BarraNav />

                {/* Área de renderizado para las sub-rutas (Tablas, Formularios) */}
                <ContentWrapper>
                    <OutletContainer>
                        <Outlet />
                    </OutletContainer>
                </ContentWrapper>
            </PageContent>

        </MainContainer>
    );
};

export default Index;