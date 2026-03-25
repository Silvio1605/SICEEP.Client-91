const PermisosData = [
    {
        id: 1,
        titulo: 'Usuarios',
        permisos: [
            {
                id: 1,
                nombrePermiso: 'Crear Cuenta de Usuario',
                descripcion: 'Permite crear cuentas nuevas con permisos por defecto',
                checked: true
            },
            {
                id: 2,
                nombrePermiso: 'Asignar Permisos',
                descripcion: 'Permite habilitar y desahabilitar permisos',
                checked: true
            },
            {
                id: 3,
                nombrePermiso: 'Editar cuentas',
                descripcion: 'Permite cambiar fecha de expiración de cuenta y cambiar contraseña',
                checked: false      
            },
            {
                id: 4,
                nombrePermiso: 'Deshabilitar cuenta',
                descripcion: 'Permite cancelar el uso de la cuenta',
                checked: false
            }
        ]
    },
    {
        id:2,
        titulo: 'Expediente Electrónico',
        permisos: [
            {
                id: 5,
                nombrePermiso: 'Registrar Empleado',
                descripcion: 'Permite agregar los datos de nuevo personal',
                checked: true  
            },
            {
                id: 6,
                nombrePermiso: 'Registrar Nivel Academico',
                descripcion: 'Permite registrar datos academicos y guardar documentos de soporte',
                checked: false
            }
        ]
    },
    {
        id: 3,
        titulo: 'Reportes y Estadisticas',
        permisos: [
            {
                id: 7,
                nombrePermiso: 'Generar Fuerza Laboral',
                descripcion: 'Permite generar y ver informe de la distribucion del personal',
                checked: false  
            },
        ]
    },
    {
        id: 4,
        titulo: 'Documentos',
        permisos: [
            {
                id: 8,
                nombrePermiso: 'Descargar Documentos',
                descripcion: 'Permite descargar documentos de soporte',
                checked: false
            },
        ]
    }
];

export default PermisosData;