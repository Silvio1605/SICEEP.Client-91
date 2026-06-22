export const columnsEstructura = ({ isMobile }) => [
    !isMobile && {
        field: 'id', headerName: 'No.', flex: 2, minWidth: 5, maxWith: 10,
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'codigo', headerName: 'Código', flex: 2, minWidth: 30, maxWith: 30,
        align: 'center', headerAlign: 'center', headerClassName: 'header-negrita',
    },
    {
        field: 'estructura', headerName: 'Estructura', flex: 2, minWidth: 30, maxWith: 30,
        align: 'center', headerAlign: 'center', headerClassName: 'header-negrita',
    }
].filter(Boolean);