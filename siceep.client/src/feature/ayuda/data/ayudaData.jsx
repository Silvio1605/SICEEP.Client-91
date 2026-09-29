import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import BadgeIcon from '@mui/icons-material/Badge';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import DescriptionIcon from '@mui/icons-material/Description';
import WorkIcon from '@mui/icons-material/Work';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import BarChartIcon from '@mui/icons-material/BarChart';
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LockResetIcon from '@mui/icons-material/LockReset';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import HomeIcon from '@mui/icons-material/Home';

export const modulos = [
    {
        titulo: 'Configuración',
        icono: <SettingsIcon fontSize="small" />,
        color: 'primary.main',
        ruta: '/index/configuracion',
        desc: 'Mi cuenta, cambio de contraseña y ayuda.',
    },
    {
        titulo: 'Usuarios',
        icono: <PersonIcon fontSize="small" />,
        color: 'primary.main',
        ruta: '/index/usuarios',
        desc: 'Crea y administra los accesos al sistema.',
    },
    {
        titulo: 'Permisos',
        icono: <KeyIcon fontSize="small" />,
        color: 'info.main',
        ruta: '/index/permisos',
        desc: 'Asigna roles y permisos a los usuarios.',
    },
    {
        titulo: 'Historial',
        icono: <HistoryEduIcon fontSize="small" />,
        color: 'secondary.main',
        ruta: '/index/historial',
        desc: 'Consulta la bitácora de actividades.',
    },
    {
        titulo: 'Buscar Expediente',
        icono: <BadgeIcon fontSize="small" />,
        color: 'success.main',
        ruta: '/index/expedientes',
        desc: 'Busca y abre el expediente de un empleado.',
    },
    {
        titulo: 'Nuevo Expediente',
        icono: <AddBoxIcon fontSize="small" />,
        color: 'success.main',
        ruta: '/index/crear-expediente',
        desc: 'Registra un nuevo expediente personal.',
    },
    {
        titulo: 'Búsqueda Rápida',
        icono: <ManageSearchIcon fontSize="small" />,
        color: 'warning.main',
        ruta: '/index/busqueda-rapida',
        desc: 'Localiza información puntual de un empleado.',
    },
    {
        titulo: 'Gestión Documentos',
        icono: <DescriptionIcon fontSize="small" />,
        color: 'grey.700',
        ruta: '/index/gestion-documentos',
        desc: 'Sube y administra documentos del expediente.',
    },
    {
        titulo: 'Plazas',
        icono: <WorkIcon fontSize="small" />,
        color: 'primary.main',
        ruta: '/index/plazas',
        desc: 'Gestiona el catálogo de plazas.',
    },
    {
        titulo: 'Movimientos',
        icono: <SwapHorizIcon fontSize="small" />,
        color: 'info.main',
        ruta: '/index/movimientos',
        desc: 'Registra el recorrido laboral del empleado.',
    },
    {
        titulo: 'Deducciones',
        icono: <ReceiptLongIcon fontSize="small" />,
        color: 'secondary.main',
        ruta: '/index/deducciones',
        desc: 'Controla las deducciones de instituciones externas.',
    },
    {
        titulo: 'Estadísticas',
        icono: <BarChartIcon fontSize="small" />,
        color: 'success.main',
        ruta: '/index/estadisticas',
        desc: 'Visualiza el panel de control de la fuerza laboral.',
    },
    {
        titulo: 'Instituciones Académicas',
        icono: <SchoolIcon fontSize="small" />,
        color: 'warning.main',
        ruta: '/index/instituciones',
        desc: 'Catálogo de instituciones académicas.',
    },
    {
        titulo: 'Ubicaciones',
        icono: <LocationOnIcon fontSize="small" />,
        color: 'grey.700',
        ruta: '/index/catalogos-ubicaciones',
        desc: 'Catálogo de estructuras, unidades y ubicaciones.',
    },
    {
        titulo: 'Cerrar Sesión',
        icono: <ExitToAppIcon fontSize="small" />,
        color: 'error.main',
        ruta: '/',
        desc: 'Salir de forma segura del sistema.',
    },
];

export const guias = [
    {
        titulo: '¿Cómo acceder al sistema y a la página principal?',
        icono: <HomeIcon fontSize="small" />,
        pasos: [
            'Ingresa tus credenciales en la pantalla de Inicio de Sesión.',
            'Al iniciar sesión correctamente, serás redirigido a la Página Principal.',
            'El menú lateral mostrará únicamente los módulos a los que tienes permiso según tu rol.',
        ],
    },
    {
        titulo: '¿Cómo cambiar mi propia contraseña?',
        icono: <VpnKeyIcon fontSize="small" />,
        pasos: [
            'Haz clic en "Mi Cuenta" en la sección de Sesión del menú lateral.',
            'Escribe tu contraseña actual para confirmar que eres tú.',
            'Ingresa la nueva contraseña y luego confírmala en el campo siguiente.',
            'La nueva contraseña debe cumplir con la política de seguridad: mínimo 8 caracteres, incluir mayúsculas, minúsculas, números y al menos un carácter especial, y no puede contener espacios.',
            'No puede ser igual a la contraseña actual.',
            'Presiona "Cambiar contraseña". Los requisitos se marcan en verde a medida que los cumples.',
            'La próxima vez inicia sesión con tu nueva contraseña.',
        ],
    },
    {
        titulo: '¿Cómo dar de alta a un empleado?',
        icono: <AddBoxIcon fontSize="small" />,
        pasos: [
            'Entra a "Expediente > Nuevo Expediente".',
            'Completa los datos obligatorios (nombre, apellido, fecha de nacimiento y sexo).',
            'Registra la información familiar, laboral y académica que corresponda.',
            'Guarda el expediente; con eso queda disponible para buscar en el listado.',
        ],
    },
    {
        titulo: '¿Cómo registrar una plaza?',
        icono: <WorkIcon fontSize="small" />,
        pasos: [
            'Entra a "Gestión Laboral > Plazas".',
            'Indica el cargo, la ubicación (estructura/unidad) y el salario base.',
            'Al guardarla, el sistema genera el ordinal de la plaza automáticamente.',
        ],
    },
    {
        titulo: '¿Cómo registrar un movimiento laboral?',
        icono: <SwapHorizIcon fontSize="small" />,
        pasos: [
            'En "Gestión Laboral > Movimientos" busca al empleado por nombre o cédula.',
            'Selecciona el cargo y la nueva ubicación.',
            'Registra el movimiento con su fecha de inicio; el sistema cierra el recorrido anterior.',
        ],
    },
    {
        titulo: '¿Cómo registrar una deducción?',
        icono: <ReceiptLongIcon fontSize="small" />,
        pasos: [
            'En "Gestión Laboral > Deducciones" selecciona al empleado.',
            'Elige el tipo de deducción y la institución emisora.',
            'Ingresa el monto, la total deuda y el período; guarda el registro.',
            'Si la institución no existe, agrégala desde el catálogo lateral.',
        ],
    },
    {
        titulo: '¿Cómo generar un trámite o documento?',
        icono: <DescriptionIcon fontSize="small" />,
        pasos: [
            'Abre el expediente del empleado desde "Buscar Expediente".',
            'Ve a la sección "Documentos" y sube el archivo (PDF o imagen).',
            'El documento queda adjunto al expediente para su consulta posterior.',
        ],
    },
    {
        titulo: '¿Qué pasa si olvido mi contraseña?',
        icono: <LockResetIcon fontSize="small" />,
        pasos: [
            'Solicita el restablecimiento a un usuario administrador (no se restablece de forma automática).',
            'El administrador, desde "Usuarios > Perfil del usuario", utilizará la opción "Restablecer Contraseña".',
            'Ingresa con la contraseña asignada temporalmente y cámbiala desde "Configuración > Mi Cuenta" la primera vez para mayor seguridad.',
        ],
    },
    {
        titulo: '¿Cómo cerrar sesión de forma segura?',
        icono: <ExitToAppIcon fontSize="small" />,
        pasos: [
            'Haz clic en "Cerrar Sesión" en el menú lateral.',
            'El sistema cerrará tu sesión, invalidará el token de acceso y te redirigirá a la pantalla de Inicio de Sesión.',
            'Recomendación: siempre cierra sesión al terminar de usar el sistema, especialmente en equipos compartidos.',
        ],
    },
];

export const consejos = [
    'Usa "Configuración > Mi Cuenta" para mantener actualizada y segura tu información de acceso.',
    'Usa la Búsqueda Rápida cuando solo necesites un dato puntual de un empleado.',
    'Las deducciones se reportan por mes y por institución; revisa el listado antes de cerrar el período.',
    'El Panel de Control (Estadísticas) se actualiza con los datos guardados; refresca la página para ver los cambios.',
    'Registra los documentos del empleado apenas los recibas para mantener el expediente al día.',
    'La información sensible solo debe consultarse con fines laborales autorizados.',
    'Siempre cierra sesión al finalizar tu jornada de trabajo en equipos compartidos.',
];